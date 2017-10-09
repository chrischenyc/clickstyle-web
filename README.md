## run in development env
`meteor --setings settings-development.json`

## heroku deploy
run following command to push the latest credentials to heroku ENV

`heroku config:add METEOR_SETTINGS="$(cat settings-production.json)"`
