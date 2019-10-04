@user @user_graphql
Feature: Update a user

@database
Scenario: User should be able to update his username
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: UpdateProfileInput!) {
      updateProfile(input: $input) {
        viewer {
          id
          username
        }
      }
    }",
    "variables": {
      "input": {
        "username": "Nouveau username"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProfile": {
        "viewer": {
          "id": "VXNlcjp1c2VyNQ==",
          "username": "Nouveau username"
        }
      }
    }
  }
  """

@database
Scenario: User should be able to update his personal data
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePersonalDataMutation($input: UpdateProfilePersonalDataInput!) {
      updateProfilePersonalData(input: $input) {
        user {
          id
          firstname
          lastname
          gender
          dateOfBirth
          address
          address2
          city
          zipCode
          phone
        }
      }
    }",
    "variables": {
      "input": {
        "firstname": "New firstname",
        "lastname": "new lastname",
        "gender": "OTHER",
        "dateOfBirth": "1992-12-12",
        "address": "noway",
        "address2":	null,
        "city": "Paris",
        "zipCode": "75012",
        "phone": null
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProfilePersonalData": {
        "user": {
          "id": "VXNlcjp1c2VyNQ==",
          "firstname": "New firstname",
          "lastname": "new lastname",
          "gender": "OTHER",
          "dateOfBirth": "1992-12-12 00:00:00",
          "address":"noway",
          "address2": null,
          "city": "Paris",
          "zipCode": "75012",
          "phone": null
        }
      }
    }
  }
  """

@database
Scenario: A super admin wants to update personal data of an other user
  Given I am logged in to graphql as super admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePersonalDataMutation($input: UpdateProfilePersonalDataInput!) {
      updateProfilePersonalData(input: $input) {
        user {
          id
          firstname
          lastname
          gender
          dateOfBirth
          address
          address2
          city
          zipCode
          phone
        }
      }
    }",
    "variables": {
      "input": {
        "userId": "VXNlcjp1c2VyNTE2",
        "firstname": "New firstname",
        "lastname": "new lastname",
        "gender": "OTHER",
        "dateOfBirth": "1992-12-12",
        "address": "noway",
        "address2":	null,
        "city": "Paris",
        "zipCode": "75012",
        "phone": null
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProfilePersonalData": {
        "user": {
          "id": "VXNlcjp1c2VyNTE2",
          "firstname": "New firstname",
          "lastname": "new lastname",
          "gender": "OTHER",
          "dateOfBirth": "1992-12-12 00:00:00",
          "address":"noway",
          "address2": null,
          "city": "Paris",
          "zipCode": "75012",
          "phone": null
        }
      }
    }
  }
  """

@security
Scenario: User should not be able to update personal data of an other user
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePersonalDataMutation($input: UpdateProfilePersonalDataInput!) {
      updateProfilePersonalData(input: $input) {
        user {
          id
          firstname
          lastname
          gender
          dateOfBirth
          address
          address2
          city
          zipCode
          phone
        }
      }
    }",
    "variables": {
      "input": {
        "userId": "VXNlcjp1c2VyNTE2",
        "firstname": "New firstname",
        "lastname": "new lastname",
        "gender": "OTHER",
        "dateOfBirth": "1992-12-12",
        "address": "noway",
        "address2":	null,
        "city": "Paris",
        "zipCode": "75012",
        "phone": null
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "errors":[{"message":"Only a SUPER_ADMIN can edit data from another user. Or the account owner","@*@": "@*@"}],"data":{"updateProfilePersonalData":null}
  }
  """

@database
Scenario: User should be able to update his public data
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePublicDataMutation($input: UpdateProfilePublicDataInput!) {
      updateProfilePublicData(input: $input) {
        user {
          id
          username
          websiteUrl
          biography
        }
      }
    }",
    "variables": {
      "input": {
        "username": "New username",
        "websiteUrl": "http://perdu.com",
        "biography": null
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProfilePublicData": {
        "user": {
          "id": "VXNlcjp1c2VyNQ==",
          "username": "New username",
          "websiteUrl": "http://perdu.com",
          "biography": null
        }
      }
    }
  }
  """

@database
Scenario: Super Admin should be able to update public data of an other user
  Given I am logged in to graphql as super admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePublicDataMutation($input: UpdateProfilePublicDataInput!) {
      updateProfilePublicData(input: $input) {
        user {
          id
          username
          websiteUrl
          biography
        }
      }
    }",
    "variables": {
      "input": {
        "userId": "VXNlcjp1c2VyNTE2",
        "username": "New username",
        "websiteUrl": "http://perdu.com",
        "biography": null
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProfilePublicData": {
        "user": {
          "id": "VXNlcjp1c2VyNTE2",
          "username": "New username",
          "websiteUrl": "http://perdu.com",
          "biography": null
        }
      }
    }
  }
  """

@security
Scenario: User should not be able to update personal data of an other user
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePublicDataMutation($input: UpdateProfilePublicDataInput!) {
      updateProfilePublicData(input: $input) {
        user {
          id
          username
          websiteUrl
          biography
        }
      }
    }",
    "variables": {
      "input": {
        "userId": "VXNlcjp1c2VyNTE2",
        "username": "New username",
        "websiteUrl": "http://perdu.com",
        "biography": null
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "errors":[{"message":"Only a SUPER_ADMIN can edit data from another user. Or the account owner","@*@": "@*@"}],"data":{"updateProfilePublicData":null}
  }
  """

@database
Scenario: User should be able to update his password
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePasswordMutation($input: UpdateProfilePasswordInput!) {
      updateProfilePassword(input: $input) {
        user {
          id
          username
        }
        error
      }
    }",
    "variables": {
      "input": {
        "current_password": "user",
        "new_password": "Azerty1234"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProfilePassword": {
        "user": {
          "id": "VXNlcjp1c2VyNQ==",
          "username": "user"
        },
        "error": null
      }
    }
  }
  """

@security
Scenario: User should be able to update his password, but give a bad current password
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePasswordMutation($input: UpdateProfilePasswordInput!) {
      updateProfilePassword(input: $input) {
        user {
          id
          username
        },
        error
      }
    }",
    "variables": {
      "input": {
        "current_password": "userqsdqsdqsd",
        "new_password": "Azerty1234"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data":{
      "updateProfilePassword":{
        "user":{
          "id":"VXNlcjp1c2VyNQ==",
          "username":"user"
        },
        "error":"fos_user.password.not_current"
      }
    }
  }
  """

@database
Scenario: Super admin should be able to update other user account
  Given I am logged in to graphql as super admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateUserAccountMutation($input: UpdateUserAccountInput!) {
      updateUserAccount(input: $input) {
        user {
          id
          vip
          enabled
          roles
        }
      }
    }",
    "variables": {
      "input": {
        "userId": "VXNlcjp1c2VyNTE2",
        "vip": true,
        "enabled": true,
        "roles": ["ROLE_ADMIN", "ROLE_USER", "ROLE_SUPER_ADMIN"]
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data":{
      "updateUserAccount":{
        "user":{
          "id":"VXNlcjp1c2VyNTE2",
          "vip":true,
          "enabled":true,
          "roles":["ROLE_SUPER_ADMIN","ROLE_ADMIN","ROLE_USER"]
        }
      }
    }
  }
  """

@database
Scenario: Admin should be able to update other user account
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateUserAccountMutation($input: UpdateUserAccountInput!) {
      updateUserAccount(input: $input) {
        user {
          id
          vip
          enabled
          roles
        }
      }
    }",
    "variables": {
      "input": {
        "userId": "VXNlcjp1c2VyNTE2",
        "vip": true,
        "enabled": true,
        "roles": ["ROLE_ADMIN", "ROLE_USER"]
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data":{
      "updateUserAccount":{
        "user":{
          "id":"VXNlcjp1c2VyNTE2",
          "vip":true,
          "enabled":true,
          "roles":["ROLE_SUPER_ADMIN","ROLE_ADMIN","ROLE_USER"]
        }
      }
    }
  }
  """

@security
Scenario: Admin should not be able to update other/own user as super admin
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateUserAccountMutation($input: UpdateUserAccountInput!) {
      updateUserAccount(input: $input) {
        user {
          id
          vip
          enabled
          roles
        }
      }
    }",
    "variables": {
      "input": {
        "userId": "VXNlcjp1c2VyQWRtaW4=",
        "vip": true,
        "enabled": true,
        "roles": ["ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_USER"]
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
"errors":[{"message":"You are not able to add super_admin role to a user.","@*@": "@*@"}],"data":{"updateUserAccount":null}
  }
  """

@database
Scenario: A hacker want to inject HTML into username
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation UpdateProfilePublicDataMutation($input: UpdateProfilePublicDataInput!) {
      updateProfilePublicData(input: $input) {
        user {
          id
          username
        }
      }
    }",
    "variables": {
      "input": {
        "username": "<h1><a href=x></a>pwned</h1>"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProfilePublicData": {
        "user": {
          "id": "VXNlcjp1c2VyNQ==",
          "username": "pwned"
        }
      }
    }
  }
  """
