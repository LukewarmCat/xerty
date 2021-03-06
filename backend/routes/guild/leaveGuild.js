const db = require("quick.db");
const passwordHash = require('password-hash');
const accounts = new db.table('accounts');
const guilds = new db.table('guilds');

module.exports = function(app) {
  app.post('/leaveGuild', (req, res) => {
    const password = req.body.password
    const username = req.body.username
    const guild = req.body.guild

    if(!accounts.get(username))
      return res.send({error: "User doesn't exist."})

    if(!username || !password)
      return res.send({error: "Username or password empty."});

    if (!passwordHash.verify(password, accounts.get(username).password))
      return res.send({error: "Incorrect username or password."});

    const player = accounts.get(username);

    if(!player.guild)
      return res.send({error: "You aren't in a guild."});

    if(player.guild.owner === username)
      return res.send({error: "You own this guild. Please delete it."});

    const temp = guilds.get(player.guild.name);

    player.guild = undefined;

    var index = temp.accounts.indexOf(username);
    if (index !== -1) temp.accounts.splice(index, 1);

    guilds.set(temp.name, temp);
    accounts.set(username, player);
    res.send({sucess: "Guild left."})
  })
}
