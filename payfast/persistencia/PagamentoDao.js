var list = [];

function PagamentoDao(connection) {
    this._connection = connection;
}

PagamentoDao.prototype.salva = function (pagamento, callback) {
    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
}

PagamentoDao.prototype.atualiza = function (pagamento, callback) {
    this._connection.query('UPDATE pagamentos SET status = ? where id = ?', [pagamento.status, pagamento.id], callback);
}

PagamentoDao.prototype.lista = function (req, res) {
    var query = this._connection.query({
        sql: 'SELECT * FROM pagamentos order by data desc, id desc',
        timeout: 40000 // 40s 40000
    });

    query
        .on('error', function (err) {
            res.status(500).send(err);
        })
        .on('fields', function (fields) {
            //return fields
        })
        .on('result', function (row) {
            this._connection.pause();

            processRow(row, function () {
            });
            this._connection.resume();
        })
        .on('end', function () {
            res.status(200).send(list);
        }
        )
}

processRow = function (row) {
    list.push(row);
}

PagamentoDao.prototype.buscaPorId = function (id, callback) {
    this._connection.query("select * from pagamentos where id = ?", [id], callback);
}

module.exports = function () {
    return PagamentoDao;
};
