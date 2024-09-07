let message = 'Error: chromeExtension/main.js is not built, '
message += 'execute "deno run --allow-env --allow-read --allow-run build.run.ts" or '
message += '"deno run --allow-all build.run.ts" in the root of the project to build it.'
console.error(message)
alert(message)
document.body.innerHTML += message