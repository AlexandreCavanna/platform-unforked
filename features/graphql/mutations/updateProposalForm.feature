@updateProposalForm
Feature: Update Proposal Form

@database
Scenario: GraphQL client wants to update a proposal form
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: UpdateProposalFormInput!) {
          updateProposalForm(input: $input) {
            proposalForm {
              id
              title
              titleHelpText
              allowAknowledge
              description
              descriptionHelpText
              summaryHelpText
              illustrationHelpText
              usingThemes
              themeMandatory
              themeHelpText
              usingDistrict
              districtMandatory
              districtHelpText
              usingCategories
              categoryMandatory
              categoryHelpText
              usingAddress
              addressHelpText
              proposalInAZoneRequired
              latMap
              lngMap
              zoomMap
              commentable
              costable
              categories(order: ALPHABETICAL) {
                id
                name
              }
              districts {
                id
                name
                geojson
                geojsonStyle
                displayedOnMap
              }
              questions {
                id
                helpText
                private
                required
                title
                type
              }
            }
          }
        }",
    "variables":{
      "input": {
        "proposalFormId": "proposalForm1",
        "title": "New title",
        "titleHelpText": "Title help",
        "description": "New description",
        "descriptionHelpText": "Description help",
        "summaryHelpText": "Summary Help",
        "illustrationHelpText": "Illustration Help",
        "usingThemes": true,
        "themeMandatory": true,
        "themeHelpText": "Theme Help",
        "usingDistrict": true,
        "allowAknowledge": true,
        "districtMandatory": true,
        "districtHelpText": "District Help",
        "usingCategories": true,
        "categoryMandatory": true,
        "proposalInAZoneRequired": true,
        "categoryHelpText": "Category Help",
        "usingAddress": true,
        "addressHelpText": "Address help",
        "latMap": 0.0,
        "lngMap": 0.0,
        "zoomMap": 0,
        "commentable": true,
        "costable": true,
        "categories": [{
            "id": "pCategory1",
            "name": "Aménagement"
          },
          {
            "id": "pCategory2",
            "name": "Politique"
          },
          {
            "name": "New category"
          }
        ],
        "districts": [{
            "name": "Beauregard",
            "displayedOnMap": false,
            "geojson": "",
            "geojsonStyle": ""
          },
          {
            "name": "Other district",
            "displayedOnMap": true,
            "geojson": "",
            "geojsonStyle": ""
          }
        ],
        "questions": []
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
   "data": {
      "updateProposalForm": {
        "proposalForm": {
          "id": "proposalForm1",
          "title": "New title",
          "titleHelpText": "Title help",
          "allowAknowledge": true,
          "description": "New description",
          "descriptionHelpText": "Description help",
          "summaryHelpText": "Summary Help",
          "illustrationHelpText": "Illustration Help",
          "usingThemes": true,
          "themeMandatory": true,
          "themeHelpText": "Theme Help",
          "usingDistrict": true,
          "districtMandatory": true,
          "districtHelpText": "District Help",
          "usingCategories": true,
          "categoryMandatory": true,
          "categoryHelpText": "Category Help",
          "usingAddress": true,
          "addressHelpText": "Address help",
          "proposalInAZoneRequired": true,
          "latMap": 0,
          "lngMap": 0,
          "zoomMap": 0,
          "commentable": true,
          "costable": true,
          "categories": [
            {
              "id": "pCategory1",
              "name": "Aménagement"
            },
            {
              "id": @string@,
              "name": "New category"
            },
            {
              "id": "pCategory2",
              "name": "Politique"
            }
          ],
          "districts": [
            {
              "id": @string@,
              "name": "Beauregard",
              "geojson": null,
              "geojsonStyle": null,
              "displayedOnMap": false
            },
            {
              "id": @string@,
              "name": "Other district",
              "geojson": null,
              "geojsonStyle": null,
              "displayedOnMap": true
            }
          ],
          "questions": []
        }
      }
    }
  }
  """

@database
Scenario: GraphQL client wants to update custom fields of a proposal form
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: UpdateProposalFormInput!) {
      updateProposalForm(input: $input) {
        proposalForm {
          id
          questions {
            id
            helpText
            private
            required
            title
            type
          }
        }
      }
    }",
    "variables": {
      "input": {
        "proposalFormId": "proposalForm1",
        "questions": [
          {
            "question": {
              "title": "Etes-vous réél ?",
              "helpText": "Peut-être que non...",
              "private": false,
              "required": true,
              "type": "text"
            }
          },
          {
            "question": {
              "title": "Documents à remplir",
              "helpText": "5 fichiers max",
              "private": false,
              "required": true,
              "type": "medias"
            }
          }
        ]
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProposalForm": {
        "proposalForm": {
          "id": "proposalForm1",
          "questions": [
            {
              "id": @string@,
              "helpText": "5 fichiers max",
              "private": false,
              "required": true,
              "title": "Documents à remplir",
              "type": "medias"
            },
            {
              "id": @string@,
              "helpText": "Peut-être que non...",
              "private": false,
              "required": true,
              "title": "Etes-vous réél ?",
              "type": "text"
            }
          ]
        }
      }
    }
  }
  """

@database
Scenario: GraphQL client wants to delete the first question
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: UpdateProposalFormInput!) {
      updateProposalForm(input: $input) {
        proposalForm {
          id
          questions {
            id
            title
            type
          }
        }
      }
    }",
    "variables": {
      "input": {
        "proposalFormId": "proposalForm13",
        "questions": [
          {
            "question": {
              "id": "48",
              "title": "Question Multiple?",
              "helpText": null,
              "description": null,
              "type": "radio",
              "private": false,
              "required": false,
              "validationRule": null,
              "questionChoices": [
                {
                  "id": "questionchoice32",
                  "title": "Oui",
                  "description": null,
                  "color": null,
                  "image": null
                },
                {
                  "id": "questionchoice33",
                  "title": "Non",
                  "description": null,
                  "color": null,
                  "image": null
                },
                {
                  "id": "questionchoice34",
                  "title": "Peut être",
                  "description": null,
                  "color": null,
                  "image": null
                }
              ],
              "otherAllowed": false,
              "randomQuestionChoices": false,
              "jumps": []
            }
          }
        ],
        "proposalFormId": "proposalform13"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProposalForm": {
        "proposalForm": {
          "id": "proposalform13",
          "questions": [
            {
              "id": "48",
              "title": "Question Multiple?",
              "type": "radio"
            }
          ]
        }
      }
    }
  }
  """

@database
Scenario: GraphQL client wants to delete the first question choice
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: UpdateProposalFormInput!) {
      updateProposalForm(input: $input) {
        proposalForm {
          id
          questions {
            id
            title
            type
          }
        }
      }
    }",
    "variables": {
      "input": {
        "proposalFormId": "proposalForm13",
        "questions": [
          {
            "question": {
              "id": "1314",
              "private": false,
              "required": false,
              "title": "Question simple?",
              "type": "text"
            }
          },
          {
            "question": {
              "id": "48",
              "title": "Question Multiple?",
              "helpText": null,
              "description": null,
              "type": "radio",
              "private": false,
              "required": false,
              "validationRule": null,
              "questionChoices": [
                {
                  "id": "questionchoice33",
                  "title": "Non",
                  "description": null,
                  "color": null,
                  "image": null
                },
                {
                  "id": "questionchoice34",
                  "title": "Peut être",
                  "description": null,
                  "color": null,
                  "image": null
                }
              ],
              "otherAllowed": false,
              "randomQuestionChoices": false,
              "jumps": []
            }
          }
        ],
        "proposalFormId": "proposalform13"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateProposalForm": {
        "proposalForm": {
          "id": "proposalform13",
          "questions": [
            {
              "id": "1314",
              "title": "Question simple?",
              "type": "text"
            },
            {
              "id": "48",
              "title": "Question Multiple?",
              "type": "radio"
            }
          ]
        }
      }
    }
  }
  """
