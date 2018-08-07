import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';

export const Rooms = new Mongo.Collection('rooms');

if (Meteor.isServer) {
  Meteor.publish('rooms.list', function roomList() {
    return Rooms.find({});
  });
}

Meteor.methods({
  'rooms.createCrossroads'() {
    if (!Meteor.isServer) {
      return;
    }
    if (!Rooms.findOne({ name: { $regex: new RegExp("^CROSSROADS$", "i") } })) {
      let crossroads = {
        name: 'CROSSROADS',
        sfw: true,
        public: true,
        locked: false,
        password: null,
        preview: 'THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS',
        description: 'THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS THIS IS THE CROSSROADS',
        moderators: [],
        banlist: [],
        characters: [],
        messages: [],
        channels: [],
        creator: null,
      };
      Rooms.insert(crossroads);
    }
  },
  'rooms.create'(room) {
    if (!Meteor.isServer) {
      return;
    }
    let existingRoom = Rooms.findOne({ name: { $regex: new RegExp("^" + room.name + "$", "i") } });
    if (existingRoom) {
      throw new Meteor.Error('rooms.create.failed', 'Room already exist');
    }
    Rooms.insert(room);
  },
  'rooms.update'(room) {
    if (!Meteor.isServer) {
      return;
    }
    Rooms.update(
      { _id: room._id },
      { $set: {
        name: room.name,
        sfw: room.sfw,
        public: room.public,
        locked: room.locked,
        password: room.password,
        preview: room.preview,
        description: room.description,
        moderators: room.moderators,
        banlist: room.banlist,
        characters: room.characters,
        messages: room.messages,
        channels: room.channels,
        creator: room.creator,
      } }
    );
  },
  'rooms.delete'(roomId) {
    if (!Meteor.isServer) {
      return;
    }
    Rooms.remove({ _id: roomId });
  },
  'rooms.enter'(room) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    if (account.profile.selectedCharacter === null) {
      return;
    }
    account.profile.selectedCharacter.room = room._id;
    room.channels.length === 0 ? account.profile.selectedCharacter.channel = 'default' : account.profile.selectedCharacter.channel = room.channels[0];
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': account.profile.selectedCharacter._id},
      { $set: {
        'profile.characters.$.room': room._id,
        'profile.characters.$.channel': account.profile.selectedCharacter.channel,
        'profile.selectedCharacter': account.profile.selectedCharacter,
      } }
    );
    let joinMessage = {
      type: 'Control',
      text: `${account.profile.selectedCharacter.nickname} has entered the room`,
      channel: 'all',
      createdAt: new Date(),
      deleted: false,
      _id: Random.id(),
    };
    Rooms.update(
      { name: room.name },
      { $push: { characters: account.profile.selectedCharacter, messages: joinMessage } },
    );
  },
  'rooms.leave'(character) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    if (!character) {
      account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
      character = account.profile.selectedCharacter;
    }
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': character._id},
      { $set: {
        'profile.characters.$.room': null,
        'profile.characters.$.channel': 'default',
        'profile.selectedCharacter.room': null,
      } }
    );
    Rooms.update(
      { _id: character.room },
      { $pull: { characters: { _id: character._id } } },
      { multi: true }
    );
    let leaveMessage = {
      type: 'Control',
      text: `${account.profile.selectedCharacter.nickname} has left the room`,
      channel: 'all',
      createdAt: new Date(),
      deleted: false,
      _id: Random.id(),
    };
    Rooms.update(
      { _id: character.room },
      { $push: { messages: leaveMessage } },
    );
    Meteor.call('rooms.verifyEmpty', character.room);
  },
  'rooms.channel.select'(channel) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    account.profile.selectedCharacter.channel = channel;
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': account.profile.selectedCharacter._id },
      { $set: { 'profile.characters.$.channel': channel, 'profile.selectedCharacter': account.profile.selectedCharacter } }
    );
  },
  'rooms.postMessage'(room, message) {
    if (!Meteor.isServer) {
      return;
    }
    if (message.length > 2000) {
      message = message.substring(0, 2000);
    }
    Rooms.update(
      { name: room.name },
      { $push: { messages: message } },
    );
  },
  'rooms.updateMessage'(room, messageId, message) {
    if (!Meteor.isServer) {
      return;
    }
    if (message.length > 2000) {
      message = message.substring(0, 2000);
    }
    Rooms.update(
      { name: room.name, 'messages._id': messageId },
      { $set: { 'messages.$.text': message } }
    );
  },
  'rooms.deleteMessage'(room, message) {
    if (!Meteor.isServer) {
      return;
    }
    Rooms.update(
      { name: room.name, 'messages._id': message._id },
      { $set: { 'messages.$.deleted': true } }
    );
  },
  'rooms.pinMessage'(room, messageId, pin) {
    if (!Meteor.isServer) {
      return;
    }
    Rooms.update(
      { name: room.name, 'messages._id': messageId },
      { $set: { 'messages.$.pinned': pin } }
    );
  },
  'rooms.kickUser'(room, character) {
    if (!Meteor.isServer) {
      return;
    }
    let kickMessage = {
      type: 'Control',
      text: `${character.nickname} has been kicked from the room`,
      channel: 'all',
      createdAt: new Date(),
      deleted: false,
      _id: Random.id(),
    };
    Rooms.update(
      { _id: room._id },
      { $push: { messages: kickMessage } },
    );
    Rooms.update(
      { _id: room._id },
      { $pull: { characters: { _id: character._id } } },
    );
    Meteor.call('rooms.sendToCrossroads', character);
  },
  'rooms.kickUserFromName'(room, characterName) {
    if (!Meteor.isServer) {
      return;
    }
    let account = Meteor.users.findOne(
      { 'profile.characters.nickname': characterName },
      { fields: { 'profile.characters.$': 1 } }
    );
    if (!account) {
      return;
    }
    Meteor.call('rooms.kickUser', room, account.profile.characters[0]);
  },
  'rooms.banUser'(room, character) {
    if (!Meteor.isServer) {
      return;
    }
    let banMessage = {
      type: 'Control',
      text: `${character.nickname} has been banished from the room`,
      channel: 'all',
      createdAt: new Date(),
      deleted: false,
      _id: Random.id(),
    };
    Rooms.update(
      { _id: room._id },
      { $push: { messages: banMessage } },
    );
    Rooms.update(
      { _id: room._id },
      { $push: { banlist: character.nickname } }
    );
    Rooms.update(
      { _id: room._id},
      { $pull: { characters: { _id: character._id } } },
    );
    Meteor.call('rooms.sendToCrossroads', character);
  },
  'rooms.banUserFromName'(room, characterName) {
    if (!Meteor.isServer) {
      return;
    }
    let account = Meteor.users.findOne(
      { 'profile.characters.nickname': characterName },
      { fields: { 'profile.characters.$': 1 } }
    );
    if (!account) {
      return;
    }
    Meteor.call('rooms.banUser', room, account.profile.characters[0]);
  },
  'rooms.sendToCrossroads'(character) {
    let crossroads = Rooms.findOne({ name: 'CROSSROADS' });
    let account = Meteor.users.findOne(
      { 'profile.characters._id': character._id },
      { fields: { 'profile.selectedCharacter': 1, 'profile.characters.$': 1 } }
    );
    if (account.profile.selectedCharacter._id === character._id) {
      account.profile.selectedCharacter.room = crossroads._id;
      account.profile.selectedCharacter.channel = 'default';
    }
    Meteor.users.update(
      { 'profile.characters._id': character._id },
      { $set: {
        'profile.characters.$.room': crossroads._id,
        'profile.characters.$.channel': 'default',
        'profile.selectedCharacter': account.profile.selectedCharacter
      } }
    );
    character.room = crossroads._id;
    character.channel = 'default';
    Rooms.update(
      { name: 'CROSSROADS' },
      { $push: { characters: character } }
    );
  },
  'rooms.updateCharacterStatus'(character, status) {
    Rooms.update(
      { _id: character.room, 'characters._id': character._id },
      { $set: { 'characters.$.status': status } }
    );
  },
  'rooms.verifyEmpty'(roomId) {
    let room = Rooms.findOne({ _id: roomId });
    if (room.name === 'CROSSROADS') {
      return;
    }
    if (room.characters.length === 0) {
      Meteor.setTimeout(() => {
        room = Rooms.findOne({ _id: roomId });
        if (!room.characters) {
          return;
        }
        if (room.characters.length === 0) {
          Meteor.call('rooms.close', roomId);
        }
      }, 180000);
    }
  },
  'rooms.close'(roomId) {
    if (!Meteor.isServer) {
      return;
    }
    Rooms.update({ _id: roomId }, { $set: { closed: true } });
  }
});
