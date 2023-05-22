Bring over backend crud files for IceCreamShop from team02

# Acceptance Criteria:

- [ ] The `@Entity` class called IceCreamShop.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `IceCreamShopRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `IceCreamShopRepository.java`; the team02 instrutions erronously called it `IceCreamShop.java`; if you called it `IceCreamShop.java` please update the name now)
- [ ] The controller file `IceCreamShopController.java` is copied from team02 to team03
- [ ] The controller tests file `IceCreamShopControllerTests.java` is copied from team02 to team03

- [ ] You can see the `icecreamshops` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `icecreamshops` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `IceCreamShop` all work properly in Swagger.

