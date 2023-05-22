# Github Pages

This repo contains Github Actions workflows (under the `.github/workflows` directory) that
can automatically publish documentation to a `gh-pages` branch, and publish documentation
for the code on the Github Pages site associated with the repo.

This file explains the necessary one-time setup steps to publish this documentation.

After that, the scripts should keep it automatically up-to-date, but if you need to manually regenerate it, the information
below explains how to do that.

When you first pull from this repo into another one, you might get a red X on the Github actions that publish the Github pages site;
following the instructions below should take care of that.

# Steps to setup Github Pages for this repo

1. **Establish that there is a `gh-pages` branch**.

   The `gh-pages` branch is typically established automatically on the first push to `main` in your new repo,
   provided that Github Actions are enabled.  But you will need to check, because if it is not yet established,
   the next steps will not work.
   
   To check, visit the main page for the repo and look at the drop down menu of branches.  You should see gh-pages,
   as shown in this animation.
   
   ![gh-pages-present](https://github.com/ucsb-cs156-s23/STARTER-team03/assets/1119017/e46c6d55-84f9-4783-bf4c-30548827ed38)
   
   If you see a `gh-pages` branch, continue to the next step.
   
   <details markdown="1">
   <summary markdown="1">If you do not see a `gh-pages` branch:</summary>
   * Go to the Actions tab of the repo.
   * If necessary, enable Github Actions (if they are not enabled, you'll see a big banner saying they are not enabled,
     and a button to enable them.)
   * Manually trigger workflow 01, which should establish the gh-pages branch.
   * Check again, and when you see the `gh-pages` branch established, go to the next step.
   </details>

1. Enable Github Pages on the repo settings as shown below.
   * Select `Settings`, then `Pages`.  
   * Make sure `Source` is `Deploy from a branch`
   * Make sure the branch is `gh-pages` and that `root` is selected as the base directory.
   
   ![setup-pages-traditional-gh-pages-root](https://github.com/ucsb-cs156-s23/STARTER-team03/assets/1119017/b34ca4c4-e95b-4906-b88d-b0a708b1538f)

2. Go to the `Actions` menu, and launch workflow `02-gh-pages-rebuild` as shown. 

   ![run-workflow-02](https://user-images.githubusercontent.com/1119017/235545108-e6da1791-5a29-44e9-a8f8-ff4e7a6b889b.gif)

   Workflow 2 may take quite a while to
   finish completely, as it launches jobs to do all of the following:
   * for the backend code: build javadoc, compute test coverage with jacoco, and do a full pitest mutation testing run
   * for the frontend code: build storybook, compute test coverage, and do a full stryker mutation testing run

   Workflow 02 computes all of these in parallel for the main branch and all open pull requests (if any, but initially
   there should be none).  It does not immediately publish these to Github Pages; instead, when all of these steps are 
   done, it triggers Workflow 04, which goes through sequentially to publish these to Github Pages.   The workflow
   is structured in this way to maximize parallelism while avoiding conflicts and race conditions that can occur
   when multiple jobs are trying to update the gh-pages branch and deploy the Github Pages site at the same time.
   
   Kicking off Workflow 02 (which triggers 04 on completion) should create the full Github Pages site for the repo.
   
   You do not need to wait for the workflow 02 and 04 to finish to take the next step.
   
3. Return to the main page for the repo,  click on the gear at right, and click the box for Github Pages, as shown below
   
   ![add-gh-pages-link](https://user-images.githubusercontent.com/1119017/235330985-1d181d00-c775-4c93-aec1-87414467e0ed.gif)

   If the box is not shown, wait a bit and check back; workflows 02 and 04 need to reach the point where the 
   site is deployed; note though, that some of the links to javadoc, storybook, etc. may not work until workflows 02 
   and 04 are completely finished.

4. Go to the  Actions tab and check on the status of workflows 02 and 04.  It is not uncommon for some of these to
   fail on first run; you can use the "Rerun Failed Jobs" feature to rerun only the part that failed.
   
   If the jobs fails repeatedly, this may indicate a larger problem that needs to be investigated, but try 
   simply re-running at least once (maybe twice) before reporting an issue.

5. Once workflow 02 and 04 have completed successfully, check that the link loads the Github Pages site.  
   It should look something like this, but with your repo name in place
   of the one shown.
   
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/1119017/235750584-2e66dc07-12b3-4593-a289-7e2f2b2060c2.png">
   
   
# What should it look like?

When it works, the top level page should look something like this:

<img width="400" alt="image" src="https://user-images.githubusercontent.com/1119017/235764245-af5360e9-3e6e-4fe8-b69a-f79213febded.png">

The javadoc should look something like this:

<img width="400" alt="image" src="https://user-images.githubusercontent.com/1119017/235764018-3de19026-bab8-4308-93bf-7cad2679cbf6.png">

The storybook should look something like this:

<img width="400" alt="image" src="https://user-images.githubusercontent.com/1119017/235764128-e705b51d-761c-48df-963b-a354a1c0a575.png">


# Keeping the site up to date

As you add pull requests, the javadoc and storybook will be generated for those as well by GitHub Actions scripts. 

Note that:
* The javadoc is only generated when there is a change to the backend code (either files under `src/` or the `pom.xml` file)
* The storybook is only generated when there is a change to the frontend code (files under `frontend/`)

# Regenerating the site

If at any point, you want to rebuild the entire documentation site, you can run the GitHub Action `02-gh-pages-rebuild`
again.

   
