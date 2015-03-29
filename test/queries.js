// Test cases for query blocks, key:value members, clauses to represent their default behavior...

test('query', function() {
  equal(pes.queriesToString('q'), '"query": {}', 'We expect the [q] alias to be converted to to an empty initial query block');
});

test('match query', function() {
  var expected = ["\"match\": {",
                  "  \"FIELD\": \"TEXT\"",
                  "}"].join("\n");
  equal(pes.queriesToString('m'), expected, 'We expect the [m] alias to be converted to a default match query');
});

test('match_phrase query', function() {
  var expected = ["\"match_phrase\": {",
                  "  \"FIELD\": \"TEXT\"",
                  "}"].join("\n");
  equal(pes.queriesToString('mp'), expected, 'We expect the [mp] alias to be converted to a default match_phrase query');
});

test('match_phrase_prefix query', function() {
  var expected = ["\"match_phrase_prefix\": {",
                  "  \"FIELD\": \"TEXT\"",
                  "}"].join("\n");
  equal(pes.queriesToString('mpp'), expected, 'We expect the [mpp] alias to be converted to a default match_phrase_prefix query');
});

test('match_all query', function() {
  equal(pes.queriesToString('ma'), '"match_all": {}', 'We expect the [ma] alias to be converted to a default match_all query');
});

test('multi_match query', function() {
  equal(pes.queriesToString('mm'), '"multi_match": {}', 'We expect the [mm] alias to be converted to a default multi_match query');
});

test('dis_max query', function() {
  equal(pes.queriesToString('dm'), '"dis_max": {}', 'We expect the [mm] alias to be converted to a default dis_max query');
});

test('bool query', function() {
  equal(pes.queriesToString('bool'), '"bool": {}', 'We expect the [bool] alias to be converted to a default bool query');
  equal(pes.queriesToString('b'), '"bool": {}', 'We expect the [b] alias to be converted to a default bool query');
});

test('range query', function() {
  var expected = ["\"range\": {",
                  "  \"FIELD\": {}",
                  "}"].join("\n");
  equal(pes.queriesToString('range'), expected, 'We expect the [range] alias to be converted to a default range query');
});

// you can override the default behavior of match_phrase_prefix and match queries using ':p' tag.
// you need at least give one additional parameter to make this possible.

test('override match_phrase_prefix and match queries using [:p]', function() {
  var expected = ["\"match\": {",
                  "  \"FIELD\": {",
                  "    \"query\": \"TEXT\"",
                  "  }",
                  "}"].join("\n");
  equal(pes.queriesToString('m:p[query]'), expected, 'We expect the match [m] query to be capable of extra types with [:p] that must contain at least one member such as the query [query,qy aliases] string');

  var expected2 = ["\"match_phrase_prefix\": {",
                   "  \"FIELD\": {",
                   "    \"query\": \"TEXT\"",
                   "  }",
                   "}"].join("\n");
  equal(pes.queriesToString('mpp:p[query]'), expected2, 'We expect the match [mpp] query to be capable of extra types with [:p] that must contain at least one member such as the query [query,qy aliases] string');
});

// the existing clauses the current version of the project has:

test('queries block', function() {
  equal(pes.queriesToString('qs'), '"queries": []', 'We expect the [qs] alias to be converted to the queries block');
  equal(pes.queriesToString('queries'), '"queries": []', 'We expect the [queries] alias to be converted to the queries block');
});

test('types of should clause', function() {
  equal(pes.queriesToString('should'), '"should": {}', 'We expect the [should] alias to be converted to the should block');
  equal(pes.queriesToString('shouldN'), '"should": []', 'We expect the [shouldN] alias to be converted to the should block, so that the clause can contain nested types');
});

test('types of must clause', function() {
  equal(pes.queriesToString('must'), '"must": {}', 'We expect the [must] alias to be converted to the must block');
  equal(pes.queriesToString('mustN'), '"must": []', 'We expect the [mustN] alias to be converted to the must block, so that the clause can contain multiple types');
});

test('types of must_not clause', function() {
  equal(pes.queriesToString('mustnt'), '"must_not": {}', 'We expect the [must] alias to be converted to the must_not block');
  equal(pes.queriesToString('mustntN'), '"must_not": []', 'We expect the [mustN] alias to be converted to the must_not block, so that the clause can contain nested types');
});

// the available key:value pairs along with their dafult value as follows:

test('size', function() {
  equal(pes.queriesToString('sz'), '"size": 10', 'We expect the [sz] to be converted to the [size] member with its initial value');
  equal(pes.queriesToString('size'), '"size": 10', 'We expect the [size] to be converted to the [size] member with its initial value');
});

test('from', function() {
  equal(pes.queriesToString('fr'), '"from": 0', 'We expect the [fr] to be converted to the [from] member with its initial value');
  equal(pes.queriesToString('from'), '"from": 0', 'We expect the [from] to be converted to the [from] member with its initial value');
});

test('to', function() {
  equal(pes.queriesToString('to'), '"to": 0', 'We expect the [to] to be converted to the [to] member with its initial value');
});

test('boost', function() {
  equal(pes.queriesToString('bst'), '"boost": 1', 'We expect the [bst] to be converted to the [boost] member with its initial value');
  equal(pes.queriesToString('boost'), '"boost": 1', 'We expect the [boost] to be converted to the [boost] member with its initial value');
});

test('_source', function() {
  equal(pes.queriesToString('src'), '"_source": []', 'We expect the [src] to be converted to the [_source] member with its initial value');
  equal(pes.queriesToString('source'), '"_source": []', 'We expect the [source] to be converted to the [_source] member with its initial value');
});

test('fields', function() {
  equal(pes.queriesToString('fds'), '"fields": []', 'We expect the [fds] to be converted to the [fields] member with its initial value');
  equal(pes.queriesToString('fields'), '"fields": []', 'We expect the [fields] to be converted to the [fields] member with its initial value');
});

test('type', function() {
  equal(pes.queriesToString('typ'), '"type": "phrase"', 'We expect the [typ] to be converted to the [type] member with its initial value');
  equal(pes.queriesToString('type'), '"type": "phrase"', 'We expect the [type] to be converted to the [type] member with its initial value');
});

test('explain', function() {
  equal(pes.queriesToString('exp'), '"explain": false', 'We expect the [exp] to be converted to the [explain] member with its initial value');
  equal(pes.queriesToString('explain'), '"explain": false', 'We expect the [explain] to be converted to the [explain] member with its initial value');
});

test('query', function() {
  equal(pes.queriesToString('qy'), '"query": "TEXT"', 'We expect the [qy] to be converted to the [query] member with its initial value');
  equal(pes.queriesToString('query'), '"query": "TEXT"', 'We expect the [query] to be converted to the [query] member with its initial value');
});

test('operator', function() {
  equal(pes.queriesToString('op'), '"operator": "and"', 'We expect the [op] to be converted to the [operator] member with its initial value');
  equal(pes.queriesToString('operator'), '"operator": "and"', 'We expect the [operator] to be converted to the [operator] member with its initial value');
});

test('analyzer', function() {
  equal(pes.queriesToString('ana'), '"analyzer": "test_analyzer"', 'We expect the [ana] to be converted to the [analyzer] member with its initial value');
  equal(pes.queriesToString('analyzer'), '"analyzer": "test_analyzer"', 'We expect the [analyzer] to be converted to the [analyzer] member with its initial value');
});

test('format', function() {
  equal(pes.queriesToString('ft'), '"format": "dd/MM/yyyy"', 'We expect the [ft] to be converted to the [format] member with its initial value');
  equal(pes.queriesToString('format'), '"format": "dd/MM/yyyy"', 'We expect the [format] to be converted to the [format] member with its initial value');
});

test('gte', function() {
  equal(pes.queriesToString('gte'), '"gte": 0', 'We expect the [gte] to be converted to the [gte] member with its initial value');
});

test('gt', function() {
  equal(pes.queriesToString('gt'), '"gt": 0', 'We expect the [gt] to be converted to the [gt] member with its initial value');
});

test('lte', function() {
  equal(pes.queriesToString('lte'), '"lte": 0', 'We expect the [lte] to be converted to the [lte] member with its initial value');
});

test('lt', function() {
  equal(pes.queriesToString('lt'), '"lt": 0', 'We expect the [lt] to be converted to the [lt] member with its initial value');
});

test('cutoff_frequency', function() {
  equal(pes.queriesToString('cf'), '"cutoff_frequency": 0', 'We expect the [cf] to be converted to the [cutoff_frequency] member with its initial value');
});

test('zero_terms_query', function() {
  equal(pes.queriesToString('ztq'), '"zero_terms_query": "none"', 'We expect the [ztq] to be converted to the [zero_terms_query] member with its initial value');
});

test('max_expansions', function() {
  equal(pes.queriesToString('me'), '"max_expansions": 10', 'We expect the [me] to be converted to the [max_expansions] member with its initial value');
});

test('tie_breaker', function() {
  equal(pes.queriesToString('tb'), '"tie_breaker": 0', 'We expect the [tb] to be converted to the [tie_breaker] member with its initial value');
});

test('minimum_should_match', function() {
  equal(pes.queriesToString('msm'), '"minimum_should_match": 1', 'We expect the [msm] to be converted to the [minimum_should_match] member with its initial value');
});

test('time_zone', function() {
  equal(pes.queriesToString('tz'), '"time_zone": "+1:00"', 'We expect the [tz] to be converted to the [time_zone] member with its initial value');
});

// test cases to demostrate how to set a new value in an available key:value pairs

test('override default values of key:value pairs', function() {
  equal(pes.queriesToString('lt{100}'), '"lt": 100', 'We expect the default value of the [lt] to be changed as 100');
  equal(pes.queriesToString('qy{"hi elastic query"}'), '"query": "hi elastic query"', 'We expect the default value of the [query] to be changed as "hi elastic query"');
  equal(pes.queriesToString('ft{"dd.MM.yyyy"}'), '"format": "dd.MM.yyyy"', 'We expect the default value of the [format] to be changed as "dd.MM.yyyy"');
  equal(pes.queriesToString('exp{true}'), '"explain": true', 'We expect the default value of the [explain] to be changed as true');

  var expectedSource = ["\"_source\": [", "  \"_id\",", "  \"surname\",", "  \"lastname\"", "]"].join("\n");
  equal(pes.queriesToString('source{["_id","surname","lastname"]}'), expectedSource, 'We expect the default value of the [_source] to be changed as ["_id","surname","lastname"]');
});

// Combine all of them in order to construct the skeleton of queries!

test('all in one queries', function() {
  var expected = ["\"query\": {",
                  "  \"bool\": {",
                  "    \"should\": [",
                  "      {",
                  "        \"match\": {",
                  "          \"FIELD\": \"TEXT\"",
                  "        }",
                  "      },",
                  "      {",
                  "        \"match\": {",
                  "          \"FIELD\": \"TEXT\"",
                  "        }",
                  "      }",
                  "    ]",
                  "  }",
                  "}"].join("\n");
  equal(pes.queriesToString('q[bool[shouldN[o[m],o[m]]]]'), expected, 'We expect the "q[bool[shouldN[o[m],o[m]]]]" to be converted with no error. Note that "o" and also "a" can be used to create an empty object and array respectively!!');

  expected = ["\"query\": {",
              "  \"bool\": {",
              "    \"must\": [",
              "      {",
              "        \"range\": {",
              "          \"FIELD\": {",
              "            \"gte\": 1",
              "          }",
              "        }",
              "      }",
              "    ],",
              "    \"should\": [",
              "      {",
              "        \"range\": {",
              "          \"FIELD\": {",
              "            \"gt\": 1955",
              "          }",
              "        }",
              "      }",
              "    ]",
              "  }",
              "}"].join("\n");
  equal(pes.queriesToString('q[bool[mustN[o[range[gte{1}]]],shouldN[o[range[gt{1955}]]]]]'), expected, 'We expect the "q[bool[mustN[o[range[gte{1}]]],shouldN[o[range[gt{1955}]]]]]" to be converted with no error. Note that "o" and also "a" can be used to create an empty object and array respectively!!');

  expected = ["\"query\": {",
              "  \"bool\": {",
              "    \"must\": {",
              "      \"range\": {",
              "        \"FIELD\": {",
              "          \"gte\": 1",
              "        }",
              "      }",
              "    }",
              "  }",
              "}"].join("\n");
  equal(pes.queriesToString('q[bool[must[range[gte{1}]]]]'), expected, 'We expect the "q[bool[must[range[gte{1}]]]]" to be converted with no error. Note that "o" and also "a" can be used to create an empty object and array respectively!!');

  expected = ["\"query\": {",
              "  \"match\": {",
              "    \"FIELD\": {",
              "      \"query\": \"to be or not to be\",",
              "      \"operator\": \"or\",",
              "      \"zero_terms_query\": \"all\"",
              "    }",
              "  }",
              "}"].join("\n");
  equal(pes.queriesToString('q[m:p[qy{"to be or not to be"},op{"or"},ztq{"all"}]]'), expected, 'We expect the "q[m:p[qy{"to be or not to be"},op{"or"},ztq{"all"}]]" to be converted with no error. Note that "o" and also "a" can be used to create an empty object and array respectively!!');

  expected = ["\"query\": {",
              "  \"match\": {",
              "    \"FIELD\": \"TEXT\"",
              "  }",
              "}"].join("\n");
  equal(pes.queriesToString('q[m]'), expected, 'We expect the "q[m]" to be converted with no error. Note that "o" and "a" can be used to create an empty object and array respectively!!');

  expected = ["\"query\": {",
              "  \"match\": {",
              "    \"FIELD\": {",
              "      \"query\": \"TEXT\"",
              "    }",
              "  }",
              "}"].join("\n");
  equal(pes.queriesToString('q[m:p[query]]'), expected, 'We expect the "q[m:p[query]]" to be converted with no error. Note that "o" and "a" can be used to create an empty object and array respectively!!');

  expected = ["\"query\": {",
              "  \"match\": {",
              "    \"FIELD\": {",
              "      \"query\": \"this is a test\",",
              "      \"type\": \"phrase_prefix\"",
              "    }",
              "  }",
              "},",
              "\"size\": 10,",
              "\"boost\": 1,",
              "\"_source\": [",
              "  \"_id\",",
              "  \"surname\"",
              "],",
              "\"explain\": true"].join("\n");
  equal(pes.queriesToString('q[m:p[qy{"this is a test"},type{"phrase_prefix"}]],sz,bst,src{["_id","surname"]},exp{true}'), expected, 'We expect the "q[m:p[qy{"this is a test"},type{"phrase_prefix"}]],sz,bst,src{["_id","surname"]},exp{true}" to be converted with no error.');

});
