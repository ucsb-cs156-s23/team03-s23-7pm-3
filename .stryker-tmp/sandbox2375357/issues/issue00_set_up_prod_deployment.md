Set up a team deployment for prod on Dokku

# Acceptance Criteria:

- [ ] On your team's dokku instance, there is an app
      called team03-prod
      
      Command:

      ```
      dokku apps:create team03-prod
      ```

      See: <https://ucsb-cs156.github.io/topics/dokku/>
      
- [ ] On your team's dokku instance, you have enabled
      https for `team03-prod`
      
      See: <https://ucsb-cs156.github.io/topics/dokku/enabling_https.html>


- [ ] On your team's dokku instance, you have followed
      the steps to configure your app for postgres

      <https://ucsb-cs156.github.io/topics/dokku/postgres_database.html>


- [ ] Your team's team03-prod app is configured for 
      Google OAuth. This requires creating 
      a `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
      for the app, and the configuring the
      environment variables using `dokku config:set ...`

      * <https://ucsb-cs156.github.io/topics/oauth/oauth_google_setup.html>
      * <https://ucsb-cs156.github.io/topics/dokku/environment_variables.html>

- [ ] Your team's team03-prod app is configured with the 
      environment variables `PRODUCTION=true` and
      `ADMIN_EMAILS=...`.

      * <https://ucsb-cs156.github.io/topics/dokku/environment_variables.html>
        
- [ ] The main branch is deployed on Dokku at, for example,
      <https://team03-prod.dokku-xx-cs.ucsb.edu> (substituting your
      own dokku instance number in place of `xx`)

- [ ] A links to your team's production deployment is added to the top of your team's `README.md` file, replacing the `TODO` entry.
