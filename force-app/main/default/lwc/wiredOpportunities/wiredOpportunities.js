import { LightningElement, wire, track } from 'lwc';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import getOpportunityByStage from '@salesforce/apex/OpportunityController.getOpportunityByStage';

export default class WiredOpportunities extends LightningElement {
  //data table columns to display
  columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Stage', fieldName: 'StageName' },
    { label: 'Amount', fieldName: 'Amount', type: 'currency' }
  ];

  @track opportunityStages = [];

  @track data = [];

  dataNotFound;

  error;

  //Determines if information should be shown or hidden
  get showDataTable() {
    return this.data.length > 0
  }

  get showCombobox() {
    return this.opportunityStages.length > 0
  }

  //Get recordTypeId information from the opportunity object
  @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
  objectInfo;

  //Get picklistvalues and create array to store those values
  @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: STAGE_FIELD })
  WiredPicklist({ data, error }) {
    if (data) {
      this.opportunityStages = data.values.map(stage => {
        return { label: stage.label, value: stage.value }
      })
      this.opportunityStages.unshift({ label: 'All', value: '' })

    } else if (error) {
      this.error = error
    }
  }

  //When user selects a new opportunity stage retrieve the data using apex method
  handleChange(event) {
    this.value = event.detail.value;

    getOpportunityByStage({ oppStageSelected: this.value })
      .then(result => {
        this.error = ''
        if (result.length > 0) {
          this.dataNotFound = false;
          this.data = [...result]
        } else if (result.length === 0) {
          this.dataNotFound = true;
          this.data = [];
        }
      })
      .catch(error => {
        this.error = error;
      })
  }
}