// Automatically update files on push to master on github

const { Webhooks, createNodeMiddleware } = require('@octokit/webhooks');
const { createServer } = require('http');
const config = require('./config');
const secret = config.secret;
const { exec } = require('child_process');
const port = config.port;

const webhooks = new Webhooks({
  secret,
  path: '/',
});

// On push to master, run git pull
webhooks.on('push', async ({ payload }) => {
  if (payload.ref !== 'refs/heads/master') return;
  console.log('Pulling from remote');
  exec('git pull', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
});

const server = createServer(createNodeMiddleware(webhooks));
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
