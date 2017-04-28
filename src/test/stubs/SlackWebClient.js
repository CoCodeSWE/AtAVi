const sinon = require('sinon');


module.exports =

let stub =
{
  _reset: function()
  {
    stub.api =
    {
      test: sinon.stub()
    };

    stub.auth =
    {
      revoke: sinon.stub(),
      test: sinon.stub()
    };
    stub.bots =
    {
      info: sinon.stub()
    };
    stub.channels =
    {
      archive: sinon.stub(),
      create: sinon.stub(),
      history: sinon.stub(),
      info: sinon.stub(),
      invite: sinon.stub(),
      join: sinon.stub(),
      kick: sinon.stub(),
      leave: sinon.stub(),
      list: sinon.stub(),
      mark: sinon.stub(),
      rename: sinon.stub(),
      replies: sinon.stub(),
      setPurpose: sinon.stub(),
      setTopic: sinon.stub(),
      unarchive: sinon.stub()

    };
    stub.chat =
    {
      delete: sinon.stub(),
      meMessage: sinon.stub(),
      postMessage: sinon.stub(),
      unfurl: sinon.stub(),
      update: sinon.stub()
    };
    stub.dnd =
    {
      endDnd: sinon.stub(),
      endSnooze: sinon.stub(),
      info: sinon.stub(),
      setSnooze: sinon.stub(),
      teamInfo: sinon.stub()
    };
    stub.emoji =
    {
      list: sinon.stub()
    };
    stub.files =
    {
      comments:
      {
        add: sinon.stub(),
        delete: sinon.stub(),
        edit: sinon.stub()
      },
      delete: sinon.stub(),
      info: sinon.stub(),
      list: sinon.stub(),
      revokePublicURL: sinon.stub(),
      sharedPublicURL: sinon.stub(),
      upload: sinon.stub()
    };
    stub.groups =
    {
      archive: sinon.stub(),
      close: sinon.stub(),
      create: sinon.stub(),
      createChild: sinon.stub(),
      history: sinon.stub(),
      info: sinon.stub(),
      invite: sinon.stub(),
      kick: sinon.stub(),
      leave: sinon.stub(),
      list: sinon.stub(),
      mark: sinon.stub(),
      open: sinon.stub(),
      rename: sinon.stub(),
      replies: sinon.stub(),
      setPurpose: sinon.stub(),
      setTopic: sinon.stub(),
      unarchive: sinon.stub()
    };
    stub.im =
    {
      close: sinon.stub(),
      history: sinon.stub(),
      list: sinon.stub(),
      mark: sinon.stub(),
      open: sinon.stub(),
      replies: sinon.stub()
    };
    stub.mpim =
    {
      close: sinon.stub(),
      history: sinon.stub(),
      list: sinon.stub(),
      mark: sinon.stub(),
      open: sinon.stub(),
      replies: sinon.stub(),
    };
    stub.oauth =
    {
      access: sinon.stub()
    };
    stub.pins =
    {
      add: sinon.stub(),
      list: sinon.stub(),
      remove: sinon.stub()
    };
    stub.reactions =
    {
      add: sinon.stub(),
      get: sinon.stub(),
      list: sinon.stub(),
      remove: sinon.stub()
    };
    stub.reminders =
    {
      add: sinon.stub(),
      complete: sinon.stub(),
      delete: sinon.stub(),
      info: sinon.stub(),
      list: sinon.stub()
    };
    stub.rtm =
    {
      start: sinon.stub()
    };
    stub.search =
    {
      all: sinon.stub(),
      files: sinon.stub(),
      messages: sinon.stub()
    };
    stub.stars =
    {
      add: sinon.stub(),
      list: sinon.stub(),
      remove: sinon.stub()
    };
    stub.team =
    {
      accessLogs: sinon.stub(),
      billableInfo: sinon.stub(),
      info: sinon.stub(),
      integrationsLogs: sinon.stub(),
      profile:
      {
        get: sinon.stub()
      }
    };
    stub.usergroups =
    {
      create: sinon.stub(),
      disable: sinon.stub(),
      enable: sinon.stub(),
      list: sinon.stub(),
      update: sinon.stub(),
      users:
      {
        list: sinon.stub(),
        update: sinon.stub()
      }
    };
    stub.users =
    {
      deletePhoto: sinon.stub(),
      getPresence: sinon.stub(),
      identity: sinon.stub(),
      info: sinon.stub(),
      list: sinon.stub(),
      aetArchive: sinon.stub(),
      setPhoto: sinon.stub(),
      setPresence: sinon.stub(),
      profile:
      {
        get: sinon.stub(),
        set: sinon.stub()
      }
    }
};
