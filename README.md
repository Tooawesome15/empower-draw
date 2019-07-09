# Project Title

Empower Draw

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure that [Anaconda](https://www.anaconda.com/download/), and [Git](https://git-scm.com/) is downloaded.

### Installing

A step by step series of examples that tell you how to get a development env running

Clone this repository

```
git clone https://github.com/Tooawesome15/empower-draw.git
```

Change into the right directory with ```cd``` command.

####Optional
Create a conda environment

```
conda create --name draw tensorflow
```

When conda asks you to proceed, type ```y```

Activate conda environment
```
conda activate draw
```

Install requirements by first changing to ```root``` by using the ```cd``` command.
```
conda install --file requirements.txt
```

If there are any requirement errors when running, you can install the required requirement individually.
```
conda install (requirement)
```

## Running

Use the command
```
python server\run.py
```
to run the programme.

Current working directory is root.

Refer to above should you face any requirement errors.

## Built With

* [Anaconda](https://www.anaconda.com/) - Packages used
* [Git](https://git-scm.com/) - Cloning and managing of this repository

## Authors

* **Tooawesome15** - *Initial work and Backend* - [Tooawesome15](https://github.com/Tooawesome15)
* **J370** - *Frontend* - [J370](https://github.com/J370)

See also the list of [contributors](https://github.com/Tooawesome15/empower-draw/graphs/contributors) who participated in this project.
