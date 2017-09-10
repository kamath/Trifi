import sys
import json
import numpy as np
from scipy.optimize import minimize

def get_data_from_nodejs():
    lines = sys.stdin.readlines()
    # Only 1 line of input
    #print 'Look at me'
    #print lines
    return json.loads(lines[0])

def main():
    lines = get_data_from_nodejs()
    
    locs,sigs = [],[]
    for a in lines:
        locs.append((float(a['location'][0]),float(a['location'][1])))
        sigs.append(float(a['signal_level']))
    
    #Free Space Path Loss formula for distance
    def dist(sig, freq=2412):
        return 10**((27.55-(20*np.log10(freq)) - sig)/40.0)

    
    # every timestamp put new values in dist() calls
    # in order of L1,L2,L3
    Ls = locs
    Ds = [dist(s) for s in sigs]

    def mse(x, locations, distances):
        """
        Mean standard error to minimize
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

    #initial guess to start minmization = average of beacon positions
    initial_location = [np.mean([locs[0][0],locs[1][0],locs[2][0]]),
                        np.mean([locs[0][1],locs[1][1],locs[2][1]])]
    locations = Ls
    distances = Ds

    result = minimize(
        mse,                         # The error function
        initial_location,            # The initial guess
        args=(locations, distances), # Additional parameters for mse
        method='BFGS',           # The optimisation algorithm
        options={
            #'ftol':1e-7,         # Tolerance
            'maxiter': 1e7      # Maximum iterations
        })
    location = result.x
    print(location) # stdout is [xpos,ypos] (meters)

# Run main() when spawned directly from nodejs
if __name__ == '__main__':
    main()
