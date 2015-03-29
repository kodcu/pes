(function(factory) {

  if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    window.pes = factory({});

    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return window.pes;
      });
    }
  }

}(function(pes) {

  var queries = new queries();
  var regexes = {
    chunk: /^([\w\:]+)$/,
    trimLRB: /^(\{\n)([^]*)(\n\})$/,
    trimWS: /^  /gm,
    quotation: /\"/g,
    chain: /\;/g,
    placeholder: /(?:\#)(.*)(?:\#)/,
    enclosing: /^(?:(\w+)(\:\w+)*)(?:\[)(.*?)(?:\])\s*$/,
    injectable : /^(\w+)(?:\{)([^\}]*?)(?:\})\s*$/,
    types: /^(?:\"(?:[a-z\_]+)\"[\:\s]+([^\{\#]*)\s*)$/
  };

  function retrieveQueryFromList(syntax) {

    if (syntax.trim() == "") return;

    var matchKey = syntax.match(regexes.chunk);

    if (!matchKey) return;

    syntax = matchKey[1];
    var value = queries.getQuery(syntax);
    return value;
  }

  // returns an array containing all of the queries
  function queriesToArray(syntax) {
    var collection,
        data = parseSyntax(syntax);

    if (data) {
      collection = toArray(data);
    } else {
      console.log("Invalid query identifier(s)!");
    }

    return collection;
  }

  function queriesToString(syntax) {
    var collection,
        data = parseSyntax(syntax);

    if (data) {
      collection = toString(data);
    } else {
      console.log("Invalid query identifier(s)!");
    }

    return collection;
  }

  function parseSyntax(sentence) {
    var commands = splitSentence(sentence.trim());
    var result = new String();

    if(!commands) return;

    commands = commands.split(regexes.chain);

    if (commands.length == 1) {
      result = parseHelper(commands[0].trim());
    }
    else {
      for (var index = 0; index < commands.length; index++) {
        var query = parseHelper(commands[index].trim());
        if (query) {
          result += query;
        } else {
          return;
        }

        if (index != commands.length - 1)
          result += ",";
      }
    }

    // split the given sentence (requested queries) based on ','
    // control nested queries not to be divided in advance.
    function splitSentence(sentence) {
      var tokens = String(),
          depth = Number();

      for (var index = 0; index < sentence.length; index++) {

        depth = updateDepth(sentence, index, depth);
        tokens = appendTokens(sentence, index, depth, tokens);

        if(index == (sentence.length - 1) && depth != 0) return;
      }

      return tokens;
    }

    function updateDepth(sentence, index, depth) {
      var charCode = sentence.charCodeAt(index);
      if (charCode == 91 || charCode == 123) { // [ or {
        depth += 1;
      } else if (charCode == 93 || charCode == 125) { // ] or }
        depth -= 1;
      }
      return depth;
    }

    function appendTokens(sentence, index, depth, tokens) {
      if (sentence.charCodeAt(index) == 44 && depth == 0) {
        return tokens.concat(";");
      } else {
        return tokens.concat(sentence.charAt(index));
      }
    }

    // helper function working on while parsing the given syntax
    function parseHelper(command) {
      var ret,
          nestedQuery = command.match(regexes.enclosing);

      if (nestedQuery) {
        // e.g. m:p[query]
        ret = retrieveQueryFromList(nestedQuery[1]);
        if (ret) {
          var embeddable = ret.match(regexes.placeholder);
          if (embeddable) {

            var override = nestedQuery[2];
            if(override){
              var params = retrieveQueryFromList(override);
              if(params)
                ret = ret.replace(regexes.placeholder, params);
            }

            // e.g. query
            var subQuery = parseSyntax(nestedQuery[3]);
            if (!subQuery) return;

            ret = ret.replace(regexes.placeholder, subQuery);
          }
          else {
            return;
          }
        }
      }
      else {
        // e.g. q , [size|sz]{10}
        var injectableOption = command.match(regexes.injectable);
        if (injectableOption) {

          ret = retrieveQueryFromList(injectableOption[1]);
          var matchKeyValue = ret.match(regexes.types);
          if (matchKeyValue) {

            var newValue = injectableOption[2];
            if (newValue) {
              ret = ret.replace(matchKeyValue[1],newValue);
            }
          }
        }
        else {
          ret = retrieveQueryFromList(command);
        }

        if (ret) {
          var embeddable = ret.match(regexes.placeholder);
          if (embeddable) {
            // replace with its default value or fill empty
            ret = ret.replace(regexes.placeholder, embeddable[1]);
          }
        }
      }
      return ret;
    }

    return result;
  }

  function evaluateOutput(output) {
    var query;
    try {
      var jsonObj = eval("({" + output + "})");
      var jsonStr = JSON.stringify(jsonObj, null, 2);
      // trim left and right curly brackets to get the core json string.
      query = jsonStr.match(regexes.trimLRB);

      // trim an unnecessary whitespace in each line, if presents.
      query = query[2].replace(regexes.trimWS, '');
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      return query;
    }
  }

  function toArray(value) {
    var query = evaluateOutput(value);
    if(!query) return;
    // normalize " before creating an array based on the retrieved value/query.
    var array = query.replace(regexes.quotation, "\\\"").split("\n");
    return array;
  }

  function toString(value) {
    return evaluateOutput(value);
  }

  function queries() {

    var map = {};
    map["o"] = "{##}"; // to create an empty object
    map["a"] = "[##]"; // to create an empty array

    // including clause queries and other options (with aliases) with their default values...
    map["sz"] = "\"size\": 10";
    map["size"] = "\"size\": 10";
    map["fr"] = "\"from\": 0";
    map["from"] = "\"from\": 0";
    map["to"] = "\"to\": 0";
    map["bst"] = "\"boost\" : 1";
    map["boost"] = "\"boost\" : 1";
    map["src"] = "\"_source\": []";
    map["source"] = "\"_source\": []";
    map["fds"] = "\"fields\" : []";
    map["fields"] = "\"fields\" : []";
    map["typ"] = "\"type\" : \"phrase\"";
    map["type"] = "\"type\" : \"phrase\"";
    map["exp"] = "\"explain\": false";
    map["explain"] = "\"explain\": false";
    map["qy"] = "\"query\": \"TEXT\"";
    map["query"] = "\"query\": \"TEXT\"";
    map["op"] = "\"operator\" : \"and\"";
    map["operator"] = "\"operator\" : \"and\"";
    map["ana"] = "\"analyzer\" : \"test_analyzer\"";
    map["analyzer"] = "\"analyzer\" : \"test_analyzer\"";
    map["ft"] = "\"format\": \"dd/MM/yyyy\"";
    map["format"] = "\"format\": \"dd/MM/yyyy\"";
    map["gte"] = "\"gte\" : 0";
    map["lte"] = "\"lte\" : 0";
    map["gt"] = "\"gt\" : 0";
    map["lt"] = "\"lt\" : 0";

    map["qs"] = "\"queries\": [##]";
    map["queries"] = "\"queries\": [##]";
    map["should"] = "\"should\": {##}";
    map["shouldN"] = "\"should\": [##]";
    map["must"] = "\"must\": {##}";
    map["mustN"] = "\"must\": [##]";
    map["mustnt"] = "\"must_not\": {##}";
    map["mustntN"] = "\"must_not\": [##]";

    // this param can be used with match_phrase_prefix and match queries as m:p , mpp:p
    map[":p"] = "\"FIELD\": {##}";

    // combine only its initials
    map["cf"] = "\"cutoff_frequency\" : 0";
    map["ztq"] = "\"zero_terms_query\": \"none\"";
    map["me"] = "\"max_expansions\" : 10";
    map["tb"] = "\"tie_breaker\": 0";
    map["msm"] = "\"minimum_should_match\" : 1";
    map["tz"] = "\"time_zone\": \"+1:00\"";

    //  Queries...

    map["q"] = "\"query\": {##}";
    // match query, with default query structure
    // to ovveride this behavior use :p such as: m:p[...]
    map["m"] = "\"match\": {#\"FIELD\": \"TEXT\"#}";
    // match phrase, default
    map["mp"] = "\"match_phrase\": {\"FIELD\": \"TEXT\"}";
    // match_phrase_prefix query with default query structure
    // to ovveride this behavior use :p such as: mpp:p[...]
    map["mpp"] = "\"match_phrase_prefix\": {#\"FIELD\": \"TEXT\"#}";
    // match_all query
    map["ma"] = "\"match_all\": {##}";
    // multi_match query
    map["mm"] = "\"multi_match\": {##}"
      // dis max query
    map["dm"] = "\"dis_max\" : {##}";
    // bool query
    map["b"] = "\"bool\": {##}";
    map["bool"] = "\"bool\": {##}";
    // range query
    map["range"] = "\"range\" : { \"FIELD\" : {##}}"


    this.getQuery = function(shortKey) {
      return map[shortKey];
    }
  }

  pes.queriesToArray = queriesToArray;
  pes.queriesToString = queriesToString;

  return pes;
}));
