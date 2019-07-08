import os
import pickle
import numpy as np
import random
#import dask.array as da

CONFIG_PATH = os.path.join('npy_files', 'config')
X_PATH = os.path.join('npy_files', 'X.npy')
Y_PATH = os.path.join('npy_files', 'y.npy')
MAP_PATH = os.path.join('npy_files', 'doodle_map.npy')

def extract(size=500, n_files=None, binary=True, threshold=128, categories=None):
    Xs = []
    ys = []
    doodle_map = [] # Filename to Number & vice versa
    files = os.listdir('datasets')
    if n_files: files = random.sample(files, n_files)
    if categories: files = [file for file in files if os.path.splitext(file)[0] in categories]
    for index, file in enumerate(files):
        # Append to doodle map
        filename, _ = os.path.splitext(file)
        doodle_map.append(filename)
        # Load individual data
        X = np.load(os.path.join('datasets', file))
        X = X[:size]
        if binary: X = np.where(X < threshold, 0, 1)
        y = np.full((len(X),), index)
        Xs.append(X)
        ys.append(y)

    X = np.concatenate(Xs, axis=0)
    y = np.concatenate(ys)
    
    return doodle_map, X, y

def save(doodle_map, X, y):
    if not os.path.isdir('npy_files'): os.mkdir('npy_files')

    np.save(MAP_PATH, doodle_map)
    np.save(X_PATH, X)
    np.save(Y_PATH, y)

def load():
    doodle_map = np.load(MAP_PATH)
    X = np.load(X_PATH)
    y = np.load(Y_PATH)
    
    return doodle_map, X, y

def auto_load(size=500, n_files=None, binary=True, threshold=128, refresh=False, use_old=False, categories=None):
    config = None
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, 'rb') as file:
            config = pickle.load(file)
    
    if config and not refresh:
        if (config['size']      == size and 
            config['n_files']   == n_files and 
            config['binary']    == binary and 
            config['threshold'] == threshold and 
            config['categories'] == categories):
            return load()
        
    if use_old:
        if (os.path.exists(MAP_PATH) and 
            os.path.exists(X_PATH) and 
            os.path.exists(Y_PATH)):
            return load()
    
    doodle_map, X, y =  extract(size=size, n_files=n_files, binary=binary, threshold=threshold, categories=categories)
    save(doodle_map, X, y)
    
    with open(CONFIG_PATH, 'wb') as file:
        pickle.dump({
            'size': size,
            'n_files': n_files,
            'binary': binary,
            'threshold': threshold,
            'categories': categories
        }, file)
    
    return doodle_map, X, y

def dask_extract(size=500, n_files=None, binary=True, threshold=128):
    Xs = []
    ys = []
    doodle_map = [] # Filename to Number & vice versa
    files = random.sample(os.listdir('datasets'), n_files)
    for index, file in enumerate(files):
        # Append to doodle map
        filename, _ = os.path.splitext(file)
        doodle_map.append(filename)
        # Load individual data
        X = np.load(os.path.join('datasets', file))
        X = X[:size]
        if binary: X = np.where(X < 128, 0, 1)
        y = np.full((len(X),), index)
        ### Dask ###
        #X = da.from_array(X)
        #y = da.from_array(y)
        ### #### ###
        Xs.append(X)
        ys.append(y)

    X = np.concatenate(Xs, axis=0)
    y = np.concatenate(ys)
    
    return doodle_map, X, y