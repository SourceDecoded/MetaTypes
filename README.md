# Glass API and Meta Database

Fast to set up, easy to maintain, magnificently extensible and entertaining persistence and service layer.

## Glass API
Glass API presents an automatically generated API with minimal configuration, thanks to the magic of Meta Database. In addition to providing instant CRUD to your data, it also offers "actions", a straightforward way to add more complex functionality or optomizations to your API without muddying up the standard CRUD.

## Meta Database
Meta Database offers a sensible mechanism for adding functionality to your data model, through "decorators". Meta Database invokes lifecycle callbacks on the decorators at certain data events:
* prepareEntityToBeAddedAsync
* validateEntityToBeAddedAsync
* entityAddedAsync
* refineQueryableAsync
* approveEntityToBeRemovedAsync
* entityRemovedAsync
* entityUpdatedAsync
* prepareEntityToBeUpdatedAsync
* validateEntityToBeUpdatedAsync

