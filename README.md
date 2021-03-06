# Aspida

A social media detox app built with Electron and Vue.js in TypeScript.

![description](https://github.com/shufo/aspida/wiki/assets/description.gif)

Currently following platforms are supported

- Twitter
- Facebook
- Instagram
- WhatsApp

Aspida changes the hosts file directly so you can completely shut out social media from your system

## Installation

- [Windows](https://github.com/shufo/aspida/releases/download/0.1.0/Aspida.Setup.0.1.0.exe.zip)
- Linux
  - [Debian](https://github.com/shufo/aspida/releases/download/0.1.0/aspida_0.1.0_amd64.deb.zip), [Ubuntu](https://github.com/shufo/aspida/releases/download/0.1.0/aspida_0.1.0_amd64.deb.zip)
  - [RedHat](https://github.com/shufo/aspida/releases/download/0.1.0/aspida-0.1.0.x86_64.rpm.zip), [CentOS](https://github.com/shufo/aspida/releases/download/0.1.0/aspida-0.1.0.x86_64.rpm.zip)
- Mac (will be supported)

## Usage

1. Install Aspida
2. Launch app
3. Turn on switch
4. Then you can't connect to social media

## Manually Build

If you want to build package by your own. Please follow these instructions.

```bash
# install dependencies
npm install

# build electron application
npm run build

# launch app
./build/linux-unpacked/aspida # for Linux
./build/win-unpacked/Aspida.exe # for Windows
```

## Contributing

1.  Fork it
2.  Create your feature branch (`git checkout -b my-new-feature`)
3.  Commit your changes (`git commit -am 'Add some feature'`)
4.  Push to the branch (`git push origin my-new-feature`)
5.  Create new Pull Request

## License

MIT
