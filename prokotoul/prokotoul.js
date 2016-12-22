/**
 * Why prokotoul? Because misspelling is awesome.
 */
var proko = (function () {

    function Prokotoul (value) {
        this.parserType = 'naive';
        this.value = value;
        this.syntax(this.parserType);
    }

    Prokotoul.prototype.syntax = function (parser) {
        this.parserType = parser;
        this.queryParser = proko.queryParser[this.parserType];
        if (!this.queryParser) {
            throw new Error('No such parser: ' + this.parserType);
        }
        return this;
    }

    Prokotoul.prototype.prop = function (query, iterator) {
        var keys, result;

        if (query) {
            if (typeof query === 'string') {
                //keys = proko.parseQuery(query);
                keys = this.queryParser(query);
                if (typeof iterator === 'function') {
                    result = iterator(this.value, keys);
                } else {
                    result = proko.queryIterator[iterator || 'sequential'](this.value, keys);
                }
            } else {
                throw new Error('Invalid query was: ' + query);
            }
        }
        return asResultObject(result, this.parserType);
    };

    Prokotoul.prototype.asString = function (formatter) {
        let type = typeof formatter;

        if (type !== 'function') {
            if (type === 'string') {
                formatter = proko.stringFormatter[formatter];
            } else {
                formatter = proko.stringFormatter.plain;
            }
        }
        return formatter(this.value);
    };

    Prokotoul.prototype.val = function () {
        return this.value;
    };

    function asResultObject (value, parser) {
        return proko(value).syntax(parser);
    }

    return function (value) {
        return new Prokotoul(value);
    };
})();

proko.parseQuery = function (query) {
    return query.split('.');
};

proko.queryParser = {
    naive: function (query) {
        return query.split('.');
    }
};

proko.queryIterator = {
    sequential: function (value, keys) {
        let result = value;
        try {
            for (var i = 0; i < keys.length; i++) {
                result = result[keys[i]];
            }
        } catch (e) {
            result = undefined;
        }
        return result;
    }
};

proko.stringFormatter = {
    plain: function (value) {
         return (value) ? value.toString() : '';
    }
};