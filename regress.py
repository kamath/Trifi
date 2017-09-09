import numpy as np
from scipy.optimize import minimize

L1 = [4,3]
L2 = [2,2]
L3 = [3,1]

Ls = [L1,L2,L3]
Ds = [1,1,1]

def mse(x, locations, distances):
    """
    We don't know x, we're going to solve for it below.
    """
    mse = 0.0
    for location, distance in zip(locations, distances):
        distance_calculated = np.sqrt( np.power(x[0]-location[0],2) +
                                       np.power(x[1]-location[1],2) )
        mse += np.power(distance_calculated - distance, 2.0)
    return mse / len(locations)

# initial_location: (lat, long)
# locations: [ (lat1, long1), ... ]
# distances: [ distance1,     ... ] 

initial_location = [np.mean([L1[0],L2[0],L3[0]]),np.mean([L1[1],L2[1],L3[1]])]
locations = Ls
distances = Ds

result = minimize(
    mse,                         # The error function
    initial_location,            # The initial guess
    args=(locations, distances), # Additional parameters for mse
    method='L-BFGS-B',           # The optimisation algorithm
    options={
        'ftol':1e-5,         # Tolerance
        'maxiter': 1000      # Maximum iterations
    })
location = result.x
print(location)
