const mongoose = require("mongoose")
const { ObjectId } = require('mongodb');

const UnitSchema = new mongoose.Schema({

    soilMoistureSensor: {
        lastReading: {
            type: String,
            default: "0"
        },
        connected: {
            type: Boolean
        },
        lastUpdatedTime: {
            type: Date,
            default: Date.now
        },
        pastReadings: {
            reading: {
                type: String
            },
            time: {
                type: Date
            }
        }
    },
    temperatureSensor: {
        lastReading: {
            type: String,
            default: "0"
        },
        connected: {
            type: Boolean
        },
        lastUpdatedTime: {
            type: Date,
            default: Date.now
        },
        pastReadings: {
            reading: {
                type: String
            },
            time: {
                type: Date
            }
        }
    },
    lightIntensitySensor: {
        lastReading: {
            type: String,
            default: "0"
        },
        connected: {
            type: Boolean
        },
        lastUpdatedTime: {
            type: Date,
            default: Date.now
        },
        pastReadings: {
            reading: {
                type: String
            },
            time: {
                type: Date
            }
        }
    },
    humiditySensor: {
        lastReading: {
            type: String,
            default: "0"
        },
        connected: {
            type: Boolean
        },
        lastUpdatedTime: {
            type: Date,
            default: Date.now
        },
        pastReadings: {
            reading: {
                type: String
            },
            time: {
                type: Date
            }
        }
    },
    
    waterMotorActuator: {
        lastUpdatedTime: {
            type: Date,
            default: Date.now
        },
        type: {
            type: Boolean // automatic or manual
        },
        types: {
            time: {
                type: Date
            },
            amount: {
                type: String
            }
        },
        activated: {
            type: Boolean,
            default: false
        }
    },
    lightActuator: {
        lastUpdatedTime: {
            type: Date,
            default: Date.now
        },
        type: {
            type: Boolean // automatic or manual
        },
        types: {
            time: {
                type: Date
            },
            amount: {
                type: String
            }
        },
        activated: {
            type: Boolean,
            default: false
        }
    },
    buzzerActuator: {
        lastUpdatedTime: {
            type: Date,
            default: Date.now
        },
        type: {
            type: Boolean // automatic or manual
        },
        types: {
            time: {
                type: Date
            },
            amount: {
                type: String
            }
        },
        activated: {
            type: Boolean,
            default: false
        }
    },
    fertilizerActuator: {
        lastUpdatedTime: {
            type: Date,
            default: Date.now
        },
        type: {
            type: Boolean // automatic or manual
        },
        types: {
            time: {
                type: Date
            },
            amount: {
                type: String
            }
        },
        activated: {
            type: Boolean,
            default: false
        }
    },	
    userID: { // optional if module_id is there
        type: ObjectId,
        required: true
    },
	moduleID: {
        type: ObjectId,
        required: true
    },
	userName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        // required: true
    },
	createdAt: {
        type: Date,
        default: Date.now
    },
	updatedAt: {
        type: Date,
        default: Date.now
    },
    unitName: {
        type: String,
        required: true,
        default: ""
    },
    automated: {
        type: Boolean,
        required: true,
        default: false
    },
    plantType: {
        type: String,
        required: true,
        default: ""
    },

})

module.exports = mongoose.model("unit", UnitSchema)