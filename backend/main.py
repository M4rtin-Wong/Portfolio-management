
import numpy as np
import pandas as pd
from functools import reduce
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# return server info if connection success.


@app.route('/result', methods=['POST'])
def get_result():

    def chromosome(n):
        ''' Generates set of random numbers whose sum is equal to 1
            Input: Number of stocks.
            Output: Array of random numbers'''
        chrom = np.random.rand(n)
        return chrom / sum(chrom)

    def set_population(n, pop_size):
        ''' Generates population
                Input: Number of stocks.
                Output: Array of population'''
        return np.array([chromosome(n) for i in range(pop_size)])

    def mean_portfolio_return(child, changed_mean):
        ''' Return the expected return of portfolio
                    Input: Chromosome.
                    Output: Portfolio return'''

        mean = mean_hist_return
        if(changed_mean):
            mean = changed_mean
        return np.sum(np.multiply(child, mean))

    def var_portfolio_return(child, changed_cov, changed_sd):
        ''' Return variance of portfolio 
                    Input: Chromosome.
                    Output: Variance of portfolio'''
        sd = sd_hist_return
        cov = cov_hist_return
        if(changed_cov):
            sd = changed_sd
            cov = changed_cov

        part_1 = np.sum(np.multiply(child, sd) ** 2)
        temp_lst = []
        for i in range(number_of_stocks):
            for j in range(number_of_stocks):
                if (i == j):
                    continue
                else:
                    if(changed_cov):
                        temp = cov[i][j] * child[i] * child[j]
                    else:
                        temp = cov.iloc[i][j] * child[i] * child[j]
                    temp_lst.append(temp)
        part_2 = np.sum(temp_lst)
        return part_1 + part_2


    def fitness_fuction(child):
        ''' This will return the Sharpe ratio for a particular portfolio.
            Input: A child/chromosome (1D Array)
            Output: Sharpe Ratio value (Scalar)'''

        sharpe_ratio = (mean_portfolio_return(child, changed_mean) - rf) / \
            np.sqrt(var_portfolio_return(child, changed_cov, changed_sd))
        return sharpe_ratio

    def Select_elite_population(population, accepted_risk, frac=0.5):
        ''' Select elite population from the total population based on accepted risk and fitness function values.
            Input: Population and fraction of population to be considered as elite.
            Output: Elite population.'''

        # sort the population with risk first.
        population = sorted(population, key=lambda x: np.sqrt(
            var_portfolio_return(x, changed_cov, changed_sd)), reverse=False)

        # if there are no enough chromosome with accepted risk, reset the population.
        while (np.sqrt(var_portfolio_return(population[100], changed_cov, changed_sd)) > accepted_risk):
            population = set_population(number_of_stocks, 1000)
            population = sorted(population, key=lambda x: np.sqrt(
                var_portfolio_return(x, changed_cov, changed_sd)), reverse=False)
            # print("risk of population[0]", np.sqrt(var_portfolio_return(population[0])))

        # append the risk column to the population dataframe.
        df = pd.DataFrame(population)
        risk = []
        for i in range(df.shape[0]):
            risk.append(np.sqrt(var_portfolio_return(
                df.loc[i].to_numpy(), changed_cov, changed_sd)))
        df['risk'] = risk
        df = df[df['risk'] <= accepted_risk]
        population = df.drop(columns=['risk']).to_numpy()

        # sort the population with fitness function.
        population = sorted(
            population, key=lambda x: fitness_fuction(x), reverse=True)
        percentage_elite_idx = int(np.floor(len(population) * frac))

        # return the elite population.
        return population[:percentage_elite_idx]

    def mutation(parent):
        ''' Randomy choosen elements of a chromosome are swapped
            Input: Parent
            Output: Offspring (1D Array)'''
        child = parent.copy()
        n = np.random.choice(range(number_of_stocks), 2)
        while (n[0] == n[1]):
            n = np.random.choice(range(number_of_stocks), 2)
        child[n[0]], child[n[1]] = child[n[1]], child[n[0]]
        return child

    def Arithmetic_crossover(parent1, parent2):
        ''' The oﬀsprings are created according to the equation:
                Off spring A = α ∗ Parent1 + (1 −α) ∗ Parent2
                Off spring B = (1 −α) ∗ Parent1 + α ∗ Parent2

                    Where α is a random number between 0 and 1.
            Input: 2 Parents
            Output: 2 Children (1d Array)'''
        alpha = np.random.rand()
        child1 = alpha * parent1 + (1 - alpha) * parent2
        child2 = (1 - alpha) * parent1 + alpha * parent2
        return child1, child2

    def next_generation(pop_size, elite, crossover):
        ''' Generates new population from elite population 
            with mutation probability as 0.4 and crossover as 0.6.
            Input: Population Size and elite population.
            Output: Next generation population (2D Array).'''
        new_population = []
        elite_range = range(len(elite))
        while len(new_population) < pop_size:

            # parent chromosomes would undergo the process of swap mutation with probability 0.1
            mutate = np.random.choice([0, 1], p=[0.6, 0.4])

            # do mutation
            if mutate:
                indx = np.random.choice(elite_range)
                new_population.append(mutation(elite[indx]))

            # else do crossover
            else:
                # randomly choose two members from elite as parent to produce offspring.
                p1_idx, p2_idx = np.random.choice(elite_range, 2)
                c1, c2 = crossover(elite[p1_idx], elite[p2_idx])
                new_population.extend([c1, c2])
        return new_population

    # get the data from frontend
    data = request.get_json(force=True)
    print(data)

    money = float(data['cash'])
    accepted_risk = float(data['risk'])
    date_start = data['dateStart'][:8]+"01"
    date_end = data['dateEnd'][:8]+"01"
    changed_mean = data['changedMean']
    print(changed_mean)
    changed_cov = data['changedCov']
    changed_sd = []
    if(changed_cov):
        for i in range(len(changed_cov)):
            print(changed_cov[i][i])
            changed_sd.append(np.sqrt(changed_cov[i][i]))
    print(accepted_risk)
    print(date_start)
    print(date_end)
    print(changed_cov)

    old_label = data['label']
    # label the stocks
    new_label = ''
    stock = data['stock']
    for item in stock:
        # print(item['undefined'])
        new_label = new_label + str(item['label'])
    print("new label: ", new_label)
    if(old_label != new_label):
        changed_cov = ''
        changed_mean = ''

    lot_dict = {}
    portfolio = []
    files = []
    for item in stock:
        # print(item['undefined'])
        files.append(str(item['label'])+'.csv')
        portfolio.append(str(item['label']))
        lot_dict[str(item['label'])] = item['lot']
    print(files)
    print(lot_dict)

    dfs = []

    for file in files:
        temp = pd.read_csv("./stock_prices_month_2008-2022/" + file)
        temp = temp.drop(columns=['Open', 'High', 'Low', 'Adj Close', 'Volume'])
        temp.columns = ['Date', file.replace('.csv', '')]
        dfs.append(temp)

    stocks = reduce(lambda left, right: pd.merge(left, right, on='Date'), dfs)
    print(stocks.shape)
    number_of_stocks = stocks.shape[1] - 1
    stocks = stocks[stocks['Date'] >= date_start]
    stocks = stocks[stocks['Date'] <= date_end]
    print(number_of_stocks)
    print(stocks)

    # return jsonify("okay")

    monthly_return = stocks.set_index('Date')
    monthly_return = monthly_return.pct_change()
    monthly_return_mean = monthly_return.mean()
    Cumulative_returns_monthly = (1 + monthly_return).cumprod()
    hist_stock_returns = Cumulative_returns_monthly - 1

    # calculate covariance
    cov_hist_return = hist_stock_returns.cov()
    print(cov_hist_return)

    cov = []
    temp_cov = cov_hist_return
    temp_cov = temp_cov.values.tolist()
    for arr in temp_cov:
        cov.append([round(num, 6) for num in arr])
    print(cov[0][0])
    print("cov: ", cov)

    # For ease of calculations make covariance of same variable as zero.
    for i in range(number_of_stocks):
        cov_hist_return.iloc[i][i] = 0

    # calcualte mean
    mean_hist_return = hist_stock_returns.mean()
    print(mean_hist_return)

    mean = []
    temp_mean = mean_hist_return.values.tolist()
    for num in temp_mean:
        mean.append(round(num, 6))
    print("mean: ", mean)

    # calcualte SD
    sd_hist_return = hist_stock_returns.std()
    print("sd_hist_return: ", sd_hist_return)
    # Risk free factor.
    rf = 0.0094

    pop_size = 1000  # initial population = 1000

    # Initial population
    population = np.array([chromosome(number_of_stocks)
                          for _ in range(pop_size)])

    # Get initial elite population
    elite = Select_elite_population(population, accepted_risk)
    # print("this is elite", elite)

    iteration = 0
    expected_return = 100
    previous_return = 200
    previous_risk = 20
    expected_risk = 10

    while (expected_risk > accepted_risk or abs(previous_risk-expected_risk) > 0.005):

        previous_return = expected_return
        previous_risk = expected_risk
        print('Iteration:', iteration)
        expected_return = mean_portfolio_return(elite[0], changed_mean)
        expected_risk = np.sqrt(var_portfolio_return(
            elite[0], changed_cov, changed_sd))
        population = next_generation(1000, elite, Arithmetic_crossover)
        elite = Select_elite_population(population, accepted_risk)
        print('Expected returns of {} with risk of {}\n'.format(
            expected_return, expected_risk))
        iteration += 1

    print('Portfolio of stocks after all the iterations:\n')
    [print(hist_stock_returns.columns[i], ':', elite[0][i])
     for i in list(range(number_of_stocks))]

    # store the portfolio result
    result = []
    for i in list(range(number_of_stocks)):
        temp = str(hist_stock_returns.columns[i]) + \
            ":" + str("{:.2f}".format(elite[0][i]*100))
        result.append(temp)
    print(result)
    expected_return = str("{:.3f}".format(expected_return))
    expected_risk = str("{:.3f}".format(expected_risk))


    if(changed_cov and changed_mean):
        return jsonify(result, expected_return, expected_risk, changed_cov, changed_mean, cov, mean, number_of_stocks, new_label)
    if(changed_cov):
        return jsonify(result, expected_return, expected_risk, changed_cov, mean, cov, mean, number_of_stocks, new_label)
    if(changed_mean):
        return jsonify(result, expected_return, expected_risk, cov, changed_mean, cov, mean, number_of_stocks, new_label)
    return jsonify(result, expected_return, expected_risk, cov, mean, cov, mean, number_of_stocks, new_label)


if __name__ == "__main__":
    # run the application.
    app.run(host="0.0.0.0", port=8000, debug=True, use_reloader=True)
