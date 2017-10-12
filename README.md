# Stylesquard meteor + react + semantic ui app

## Running on local machine

`meteor -s settings-development.json`

## Heroku deployment

### push credentials to heroku ENV

`heroku config:add METEOR_SETTINGS="$(cat settings-production.json)"`
