# Glass API and Meta Database

Fast to set up, easy to maintain, magnificently extensible and entertaining persistence and service layer.

## Glass API
Glass API presents an automatically generated API with minimal configuration, thanks to the magic of Meta Database. In addition to providing instant CRUD to your data, it also offers "actions", a straightforward way to add more complex functionality or optomizations to your API without muddying up the standard CRUD.

## Meta Database
Meta Database offers a sensible mechanism for adding functionality to your data model, through "decorators". Meta Database invokes lifecycle callbacks on the decorators at certain data events:
* prepareEntityToBeAddedAsync(tableName, entity, options)
* validateEntityToBeAddedAsync(tableName, entity, options)
* entityAddedAsync(tableName, entity, options)
* refineQueryableAsync(user, queryable)
* approveEntityToBeRemovedAsync(tableName, entity, options)
* entityRemovedAsync(tableName, entity, options)
* entityUpdatedAsync(tableName, entity, delta, options)
* prepareEntityToBeUpdatedAsync(tableName, entity, delta, options)
* validateEntityToBeUpdatedAsync(tableName, entity, delta, options)
Note that the options object always contains at least a user key representing the currently authenticated user.
