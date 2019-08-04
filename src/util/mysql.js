// Promise based mysql query
function executeQuery(query) {
    return new Promise((resolve, reject) => {
        db.query(query, (error, result) => {
            if (error)
                reject(error)
            else
                resolve(result)
        })
    })
}

module.exports = {
    executeQuery
}