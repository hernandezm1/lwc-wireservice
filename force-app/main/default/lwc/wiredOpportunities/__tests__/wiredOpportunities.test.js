import { createElement } from 'lwc';
import WiredOpportunities from 'c/wiredOpportunities';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
//import getOpportunityByStage from '@salesforce/apex/OpportunityController.getOpportunityByStage';

// Import mock data to send through the wire adapter.
const mockGetObjectInfo = require("./data/getObjectInfo.json");
const mockGetPicklistValues = require("./data/getPicklistValues.json");

// Mocking imperative Apex method call
jest.mock(
  '@salesforce/apex/ContactController.getOpportunityByStage',
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

// Sample data for imperative Apex call
const APEX_OPPORTUNITY_BY_STAGE_SUCCESS = [
  {
    Id: '1111111111111BBBBB',
    Name: 'United Colors',
    Amount: 50500,
    StageName: 'Negotiation/Review'

  }
];

describe('c-wired-opportunities', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  it('renders a lightning card', () => {
    const element = createElement('c-wired-opportunities', {
      is: WiredOpportunities
    });
    document.body.appendChild(element);

    const cardElement = element.shadowRoot.querySelector('lightning-card');
    expect(cardElement).not.toBeNull();
  });

  describe('getPicklistValues @wire data', () => {
    it('renders a picklist with 11 options', () => {
      const element = createElement('c-wired-opportunities', {
        is: WiredOpportunities
      });
      document.body.appendChild(element);

      // Emit mock record into the wired fields
      getObjectInfo.emit(mockGetObjectInfo);
      getPicklistValues.emit(mockGetPicklistValues);

      // Resolve a promise to wait for a rerender of the new content.
      return Promise.resolve().then(() => {
        const comboboxElement = element.shadowRoot.querySelector('lightning-combobox');
        expect(comboboxElement.options.length).toBe(11);
      })
    });
  })

  describe('getPicklistValues @wire error', () => {
    it('shows error message', () => {
      const element = createElement('c-wired-opportunities', {
        is: WiredOpportunities
      });
      document.body.appendChild(element);

      // Emit mock record into the wired fields
      getObjectInfo.emit(mockGetObjectInfo);
      getPicklistValues.error();

      // Resolve a promise to wait for a rerender of the new content.
      return Promise.resolve().then(() => {
        const errorElement = element.shadowRoot.querySelector('.error');
        expect(errorElement).not.toBeNull();
        expect(errorElement.textContent).toBe('Sorry, there was an error, try again');
      })
    });
  })
});



