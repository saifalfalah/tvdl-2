@aws
runtime nodejs16.x

@app
tvdl-app

@http
get /
post /
get /ver
post /try
post /groot
post /v2

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
