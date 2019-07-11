from main import app

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(debug=True, host='192.168.1.197', port=5000)
    # app.run(debug=True, host='172.18.168.209', port=5000)