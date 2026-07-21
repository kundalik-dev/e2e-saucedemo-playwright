/**
 * Test credentials for different environments and user types
 */
const credentials = {
  // valid users
  valid: {
    standard_user: {
      username: "standard_user",
      password: "secret_sauce",
      description: "Standard user with full access",
    },
    performance_glitch_user: {
      username: "performance_glitch_user",
      password: "secret_sauce",
      description: "User that experiences performance issues",
    },
    error_user: {
      username: "error_user",
      password: "secret_sauce",
      description: "User that encounters various errors",
    },
    visual_user: {
      username: "visual_user",
      password: "secret_sauce",
      description: "User for visual testing",
    },
  },

  // invalid/problem users
  invalid: {
    locked_out_user: {
      username: "locked_out_user",
      password: "secret_sauce",
      description: "User that is locked out",
      expectedError: "Epic sadface: Sorry, this user has been locked out.",
    },
    problem_user: {
      username: "problem_user",
      password: "secret_sauce",
      description: "User with various UI problems",
    },
    invalid_user: {
      username: "invalid_user",
      password: "wrong_password",
      description: "Non-existent user credentials",
      expectedError:
        "Epic sadface: Username and password do not match any user in this service",
    },
  },
};

// auth data
const authData = {
  appUrl: "/",
  loginLogoText: "Swag Labs",
};

export { credentials, authData };
