/**
 * Created by rcartier13 on 12/3/13.
 */

describe('VIP test', function () {

  describe('Smoke test', function () {
    // Checks the number of IDs for both username and password
    it('Page loaded properly', function () {
      browser().navigateTo('http://localhost:4000');
      expect(element('#username').count()).toBe(1);
      //pause();
      expect(element('#password').count()).toBe(1);
    });
  });

  /* ----------------------------------------
              Logging In Testing
  ------------------------------------------*/
  describe('Logging in', function () {
    // Failed attempt
    it('Does not accept an invalid username + password', function () {
      input('username').enter('fakeuser');
      input('password').enter('fakepassword');
      element('#sign-in').click();
      sleep(0.2);
      expect(element('#pageHeader-error').count()).toBe(1);
    });

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      input('username').enter('testuser');
      input('password').enter('test');
      element('#sign-in').click();
      sleep(0.1);
      expect(element('#username').count()).toBe(0);
    });

    // Reloads the page, then checks if you are still logged in
    it('Still logged in after reload', function () {
      browser().reload();
      expect(element('#username').count()).toBe(0);
    });
  });

  /* ----------------------------------------
              Logging Out Testing
   ------------------------------------------*/
  describe('Logging out', function () {
    // Signs out of the application
    it('Sign out of the app', function () {
      element('#pageHeader-sign-out').click();
      sleep(0.1);
      expect(element('#username').count()).toBe(1);
    });
  });
});