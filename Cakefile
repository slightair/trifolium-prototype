{exec} = require 'child_process'

files = [
	'coffee/brave.coffee',
	'coffee/brave_status_view.coffee',
	'coffee/action.coffee'
]

exec "coffee -b -o js -c #{files.join ' '}", (error, stdout, stderr) ->
	throw error if error
	console.log(stdout + stderr)