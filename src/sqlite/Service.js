export default class Service {
    constructor(sqliteDatabase, context) {
        if (sqliteDatabase == null) {
            throw new Error("The sqlite service needs to have a sqlite database.");
        }

        if (context == null) {
            throw new Error("The sqlite service needs to have a context.");
        }

        this.sqliteDatabase = sqliteDatabase;
        this.context = context;
    }

    activateAsync(){

    }

    addEntityAsync(type, entity){

    }

    deactivateAsync(){
        
    }

    removeEntityAsync(type, entity){

    }

    updateAsync(type, entity){

    }

    asQueryable(type){

    }

}