import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Rooms } from './Rooms.js';

export const Backup = new Mongo.Collection('backup');

if (Meteor.isServer) {
  Meteor.publish('account.backup.all', function() {
    return Backup.find({});
  });

  Meteor.publish('account.all', function user() {
    return Meteor.users.find({});
  });

  Meteor.publish('account.user', function user() {
    if (this.userId) {
      return Meteor.users.find(this.userId);
    } else {
      return this.ready();
    }
  });

  Meteor.publish('account.character', function(characterName) {
    console.log(characterName);
    return Meteor.users.find(
       { 'profile.characters.nickname': { $regex: new RegExp("^" + characterName + "$", "i") } },
       { fields: { 'username': 1, 'emails': 1, 'profile.characters.$': 1 } },
    );
  });
}

Meteor.methods({
  'account.backup'(account) {
    if (!Meteor.isServer) {
      return;
    }
    Backup.insert(account);
  },
  'account.backup.update'(account) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Backup.update(
      { _id: account._id },
      { $set: { 'profile.totalExperience': account.totalExperience,
                'profile.crystals': account.crystals,
                'profile.ipAddress': account.ipAddress,
                'profile.banned': account.banned,
                'profile.refferals': account.refferals,
                'emails.0.address': account.email,
              }
      }
    );
  },
  'account.update'(account) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.update(
      { _id: account._id },
      { $set: { 'profile.totalExperience': account.totalExperience,
                'profile.crystals': account.crystals,
                'profile.ipAddress': account.ipAddress,
                'profile.refferals': account.refferals,
                'emails.0.address': account.email,
              }
      }
    );
  },
  'account.character.update'(account, character) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let existingCharacter = Meteor.users.findOne({ 'profile.characters.nickname': { $regex: new RegExp("^" + character.nickname + "$", "i") } }, { fields: { 'profile.characters.$._id': 1 } });
    if (existingCharacter && existingCharacter.profile.characters[0]._id !== character._id) {
      throw new Meteor.Error('account.character.update.failed', 'Character name already used');
    }
    Meteor.users.update(
      { _id: account._id, 'profile.characters._id': character._id },
      { $set: {
                'profile.characters.$.nickname': character.nickname,
                'profile.characters.$.gender': character.gender,
                'profile.characters.$.profile.html': character.description,
                'profile.characters.$.avatar': character.avatar,
                'profile.characters.$.socialMedia.skype': character.socialMedia.skype,
                'profile.characters.$.socialMedia.facebook': character.socialMedia.facebook,
                'profile.characters.$.socialMedia.twitter': character.socialMedia.twitter,
                'profile.characters.$.socialMedia.discord': character.socialMedia.discord,
                'profile.characters.$.sysOp': character.sysOp,
                'profile.characters.$.admin': character.admin,
                'profile.characters.$.globalModerator': character.globalModerator,
                'profile.characters.$.preferences.emailInProfile': character.preferences.emailInProfile,
                'profile.characters.$.preferences.lastLoginInProfile': character.preferences.lastLoginInProfile,
                'profile.characters.$.weburl': character.weburl,
                'profile.characters.$.refferals': character.refferals,
              }
      }
    );
  },
  'account.delete'() {
    if (!Meteor.isServer) {
      return;
    }
    if (this.userId) {
      Meteor.users.remove(this.userId, (error) => {
        if (error) {
          throw new Meteor.Error('account.delete.failed', 'Failed to delete the account. Retry again later..');
        }
      });
    }
  },
  'account.backup.remove'(accountId) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Backup.remove({ _id: accountId });
  },
  'account.remove'(accountId) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.remove({ _id: accountId });
  },
  'account.signOut'() {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let account = Meteor.users.findOne({ _id: this.userId });
    account.profile.characters.forEach(character => {
      if (character.loggedIn) {
        Rooms.update(
          { _id: character.room },
          { $pull: { characters: { _id: character._id } } },
          { multi: true }
        );
        Meteor.call('rooms.verifyEmpty', character.room);
        character.loggedIn = false;
        character.status = 'offline';
        character.room = null;
        character.channel = 'default';
      }
    });
    Meteor.users.update(
      { _id: this.userId },
      { $set: { 'profile.characters': account.profile.characters, 'profile.selectedCharacter': null } }
    );
  },
  'account.addCharacter'(character) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let existResult = Meteor.users.findOne({ 'profile.characters.nickname': { $regex: new RegExp("^" + character.nickname + "$", "i") } });
    if (existResult) {
      throw new Meteor.Error('account.addCharacter.failed', 'Character name already taken');
    }
    Meteor.users.update(this.userId, { $push: { 'profile.characters': character } });
    Backup.update({ _id: this.userId }, { $push: { 'profile.characters': character } });
  },
  'account.deleteCharacter'(character, accountName) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    if (!accountName) {
      Meteor.users.update({ _id: this.userId }, { $pull: { 'profile.characters': { _id: character._id } } });
    } else {
      Meteor.users.update({ username: accountName }, { $pull: { 'profile.characters': { _id: character._id } } });
    }
  },
  'account.updateCharacter'(character) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': character._id },
      { $set: { 'profile.characters.$': character } }
    );
    Backup.update(
      { _id: this.userId, 'profile.characters._id': character._id },
      { $set: { 'profile.characters.$': character } }
    );
  },
  'account.selectCharacter'(character) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.update(
      { _id: this.userId },
      { $set: { 'profile.selectedCharacter': character } }
    );
  },
  'account.logInCharacter'(character, room) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    character.room = room._id;
    character.status = 'online';
    character.lastLogin = new Date();
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': character._id },
      { $set: { 'profile.characters.$.loggedIn': true,
                'profile.characters.$.status': 'online',
                'profile.characters.$.room': room._id,
                'profile.characters.$.lastLogin': character.lastLogin,
                'profile.selectedCharacter': character,
      } }
    );
  },
  'account.logOutCharacter'(character) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': character._id },
      { $set: { 'profile.characters.$.loggedIn': false,
                'profile.characters.$.status': 'offline',
                'profile.characters.$.room': null,
                'profile.characters.$.channel': 'default',
      } }
    );
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    if (account.profile.selectedCharacter !== null && account.profile.selectedCharacter._id === character._id) {
      Meteor.users.update(
        { _id: this.userId },
        { $set: { 'profile.selectedCharacter': null } }
      );
    }
    Rooms.update(
      { _id: character.room },
      { $pull: { characters: { _id: character._id } } },
      { multi: true }
    );
    Meteor.call('rooms.verifyEmpty', character.room);
  },
  'account.updateCharacterStatus'(character, status) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': character._id },
      { $set: { 'profile.characters.$.status': status, 'profile.selectedCharacter.status': status } }
    );
  },
  'account.applyPreferences'(preferences) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let user = Meteor.user();
    user.profile.characters.forEach((character, index, characters) => {
      characters[index].preferences = preferences;
    });
    Meteor.users.update(
      { _id: this.userId },
      { $set: { 'profile.characters': user.profile.characters } },
    );
  },
  'account.applySettings'(settings) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.update(
      { _id: this.userId },
      { $set: { 'profile.settings': settings } },
    );
  },
  'account.addNotification'(toCharacter, fromCharacter, messageId, type) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let notif = {
      from: fromCharacter,
      messageId: messageId,
      type: type,
    };
    let nameRegEx = new RegExp("^" + toCharacter + "$", "i");
    Meteor.users.update(
      { 'profile.characters.nickname': { $regex: nameRegEx } },
      { $push: { 'profile.characters.$.notifications': notif } }
    );
    let account = Meteor.users.findOne({ 'profile.characters.nickname': { $regex: nameRegEx } }, { fields: { 'profile.selectedCharacter': 1} });
    if (account.profile.selectedCharacter !== null && nameRegEx.test(account.profile.selectedCharacter.nickname) === true) {
      Meteor.users.update(
        { 'profile.characters.nickname': nameRegEx },
        { $push: { 'profile.selectedCharacter.notifications': notif } }
      );
    }
  },
  'account.deleteNotification'(mention) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': account.profile.selectedCharacter._id },
      { $pull: { 'profile.characters.$.notifications': { messageId: mention.messageId }, 'profile.selectedCharacter.notifications': { messageId: mention.messageId } } },
      { multi: true }
    );
  },
  'account.ignoreCharacter'(character) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': account.profile.selectedCharacter._id },
      { $push: { 'profile.characters.$.ignoreList': character._id, 'profile.selectedCharacter.ignoreList': character._id } }
    );
  },
  'account.ignoreCharacterFromName'(characterName) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let ignoreAccount = Meteor.users.findOne(
      { 'profile.characters.nickname': characterName },
      { fields: { 'profile.characters.$': 1 } }
    );
    if (!ignoreAccount) {
      return;
    }
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': account.profile.selectedCharacter._id },
      { $push: { 'profile.characters.$.ignoreList': ignoreAccount.profile.characters[0]._id,
                 'profile.selectedCharacter.ignoreList': ignoreAccount.profile.characters[0]._id
               }
      }
    );
  },
  'account.unignoreCharacter'(character) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': account.profile.selectedCharacter._id },
      { $pull: { 'profile.characters.$.ignoreList': character._id, 'profile.selectedCharacter.ignoreList': character._id } }
    );
  },
  'account.updateTextColor'(color) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': account.profile.selectedCharacter._id },
      { $set: { 'profile.characters.$.textColor': color, 'profile.selectedCharacter.textColor': color } }
    );
  },
  'account.createPrivateMessage'(characterName) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    let account = Meteor.users.findOne(this.userId, { fields: { 'profile.selectedCharacter': 1} });
    let alreadyExist = false;
    account.profile.selectedCharacter.privateMessages.forEach((privateMessage) => {
      if (privateMessage.name === characterName) {
        alreadyExist = true;
      }
    });
    if (alreadyExist) {
      return;
    }
    let privateMessage = {
      name: characterName,
      messages: [],
      _id: Random.id(),
    }
    Meteor.users.update(
      { _id: this.userId, 'profile.characters._id': account.profile.selectedCharacter._id },
      { $push: { 'profile.characters.$.privateMessages': privateMessage, 'profile.selectedCharacter.privateMessages': privateMessage } }
    );
  },
  'account.postPrivateMessage'(characterName, message) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }

    let fromAccount = Meteor.users.findOne(this.userId);
    let whisper = {
      _id: Random.id(),
      toCharacter: characterName,
      channel: fromAccount.profile.selectedCharacter.channel,
      character: message.character,
      color: message.color,
      text: message.text,
      createdAt: message.createdAt,
      withBrackets: message.withBrackets,
      type: 'Whisper',
      deleted: false,
    }
    Rooms.update({ _id: fromAccount.profile.selectedCharacter.room }, { $push: { messages: whisper } });

    fromAccount.profile.selectedCharacter.privateMessages.forEach(privateMessage => {
      if (privateMessage.name === characterName) {
        privateMessage.messages.push(message);
      }
    });
    fromAccount.profile.characters.forEach(character => {
      if (character._id === fromAccount.profile.selectedCharacter._id) {
        character.privateMessages.forEach(privateMessage => {
          if (privateMessage.name === characterName) {
            privateMessage.messages.push(message);
          }
        });
      }
    });
    Meteor.users.update(
      { _id: this.userId },
      fromAccount
    );

    let toAccount = Meteor.users.findOne({ 'profile.characters.nickname': characterName}, { fields: { 'profile.characters.$': 1, 'profile.selectedCharacter': 1} });
    let alreadyExist = false;
    toAccount.profile.characters[0].privateMessages.forEach(privateMessage => {
      if (privateMessage.name === fromAccount.profile.selectedCharacter.nickname) {
        privateMessage.messages.push(message);
        alreadyExist = true;
      }
    });
    if (!alreadyExist) {
      toAccount.profile.characters[0].privateMessages.push({
        name: fromAccount.profile.selectedCharacter.nickname,
        messages: [message],
        _id: Random.id(),
      });
    }
    if (toAccount.profile.selectedCharacter.nickname === characterName) {
      Meteor.users.update(
        { _id: toAccount._id, 'profile.characters.nickname': characterName },
        { $set: { 'profile.characters.$.privateMessages': toAccount.profile.characters[0].privateMessages,
                  'profile.selectedCharacter.privateMessages': toAccount.profile.characters[0].privateMessages,
         } }
      );
    } else {
      Meteor.users.update(
        { _id: toAccount._id, 'profile.characters.nickname': characterName },
        { $set: { 'profile.characters.$.privateMessages': toAccount.profile.characters[0].privateMessages, } }
      );
    }
  },
  'account.deletePrivateMessage'(characterName) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }

    let account = Meteor.users.findOne(this.userId);
    account.profile.selectedCharacter.privateMessages = account.profile.selectedCharacter.privateMessages.filter(privateMessage => privateMessage.name !== characterName);
    account.profile.characters.forEach(character => {
      if (character._id === account.profile.selectedCharacter._id) {
        character.privateMessages = character.privateMessages.filter(privateMessage => privateMessage.name !== characterName);
      }
    });
    Meteor.users.update({ _id: this.userId }, account);
  },
  'account.updateNotes'(accountName, notes) {
    Meteor.users.update(
      { username: accountName },
      { $set: { 'profile.notes': notes } }
    );
  },
  'account.ban'(accountId) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.update(
      { _id: accountId },
      { $set: { 'profile.banned': true, 'profile.dateBanned': new Date() } }
    );
  },
  'account.unban'(accountId) {
    if (!Meteor.isServer || !this.userId) {
      return;
    }
    Meteor.users.update(
      { _id: accountId },
      { $set: { 'profile.banned': false, 'profile.dateBanned': null } }
    );
  }
});
