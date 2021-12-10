public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunityByStage(String oppStageSelected){
      String oppQuery = '%' + oppStageSelected + '%';
      try {
        if (String.isNotBlank(oppStageSelected)) {
          return [
            SELECT Name, StageName, Amount 
            FROM Opportunity
            WHERE stageName like :oppQuery
            WITH SECURITY_ENFORCED
          ];
        }
        return [
          SELECT Name, StageName, Amount 
          FROM Opportunity
          WITH SECURITY_ENFORCED
        ];

      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
}
