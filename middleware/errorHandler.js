const mongoose = require('mongoose')

const errorHandler = (err, req, res, next) => {
    let message = err
    let status = 500

    if (err instanceof mongoose.Error.ValidationError) {
        let tempErr = []
        for (let key in err.errors) {
            tempErr.push(err.errors[key].message)
        }

        message = tempErr
        status = 400
    }
    
    res.status(status).json({ message })
}

module.exports = errorHandler