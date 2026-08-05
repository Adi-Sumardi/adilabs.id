<?php
// Copy this file to api/env.php on the server and fill in the real values
// from cPanel → MySQL Databases. api/env.php is gitignored — it never
// leaves the server, so `git pull` can never wipe out or leak real
// credentials. Every entry point (config.php, seed*.php) loads this file
// first if it exists, via putenv(), so both web requests AND CLI scripts
// (which don't inherit Apache's environment) see the same values.

putenv('DB_HOST=localhost');
putenv('DB_NAME=your_cpanel_db_name');
putenv('DB_USER=your_cpanel_db_user');
putenv('DB_PASS=your_cpanel_db_password');

// Only needed if the frontend is ever served from a different origin than
// this API (not the case for this deploy — same domain).
// putenv('CORS_ORIGIN=https://adilabs.id');
