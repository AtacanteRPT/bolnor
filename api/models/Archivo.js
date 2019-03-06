module.exports = {
    tableName: 'archivo',
    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',

            autoIncrement: true,


        },
        idPersona: {
            required:false, 
            model: 'persona'
        },
        direccion: {
            type: 'string',
            required:false, allowNull:true


        }

    }

};