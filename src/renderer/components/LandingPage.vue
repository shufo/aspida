<template>
  <div id="wrapper">
    <header>
      <div class="permission alert alert-danger alert-dismissible fade show" role="alert" v-show="!permission">
        You don't have permission to write hosts file.  
        <a href="#" class="grant-permission btn btn-outline btn-sm btn-danger pull-right" @click="grantPermission">Grant Permission <i v-show="state.checking" class="spinner fas fa-spinner fa-spin"></i></a>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </header>

    <main>
      <h1 class="text-center">Aspida</h1>
      <p class="legend text-center">Bring back to your life</p>
      <div class="row">
        <span class="switch">
          <input type="checkbox" class="switch" id="all_hosts" @click="toggleAllHosts" v-model="all_hosts">
          <label for="all_hosts"><i class="fas fa-globe"></i> ALL</label>
        </span>
      </div>
      <div class="row">
        <span class="switch">
          <input type="checkbox" class="switch" data-hosts="twitter" id="twitter_hosts" v-model="hosts.twitter">
          <label for="twitter_hosts"><i class="fab fa-twitter"></i> Twitter</label>
        </span>
      </div>
      <div class="row">
        <span class="switch">
          <input type="checkbox" class="switch" data-hosts="facebook" id="facebook_hosts" v-model="hosts.facebook">
          <label for="facebook_hosts"><i class="fab fa-facebook"></i> Facebook</label>
        </span>
      </div>
      <div class="row">
        <span class="switch">
          <input type="checkbox" class="switch" data-hosts="instagram" id="instagram_hosts" v-model="hosts.instagram">
          <label for="instagram_hosts"><i class="fab fa-instagram"></i> Instagram</label>
        </span>
      </div>
      <div class="row">
        <span class="switch">
          <input type="checkbox" class="switch" data-hosts="whatsapp" id="whatsapp_hosts" v-model="hosts.whatsapp">
          <label for="whatsapp_hosts"><i class="fab fa-whatsapp"></i> WhatsApp</label>
        </span>
      </div>
    </main>
    <footer>
      <div>
        <a class="text-center" href="#" @click="open('https://github.com/shufo/aspida')"><i class="fab fa-github fa-2x fa-fw icon-gray"></i></a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SystemInformation from "./LandingPage/SystemInformation.vue";
import {
  TWITTER_HOSTS,
  FACEBOOK_HOSTS,
  INSTAGRAM_HOSTS,
  WHATSAPP_HOSTS
} from "../constants";

const _ = require("lodash");
const fs = require("fs");
const hostile = require("hostile");
const sudo = require("sudo-prompt");

const ALL_HOSTS: Array<string> = [
  ...TWITTER_HOSTS,
  ...FACEBOOK_HOSTS,
  ...INSTAGRAM_HOSTS,
  ...WHATSAPP_HOSTS
];

interface HTMLElementEvent<T extends HTMLElement> extends Event {
  target: T;
}
declare const __static: string;

export default Vue.extend({
  name: "landing-page",
  components: { SystemInformation },
  data() {
    return {
      permission: false as boolean,
      state: {
        checking: false as boolean
      },
      hosts: {
        twitter: (this as any).isEnabledHosts(TWITTER_HOSTS) as boolean,
        facebook: (this as any).isEnabledHosts(FACEBOOK_HOSTS) as boolean,
        instagram: (this as any).isEnabledHosts(INSTAGRAM_HOSTS) as boolean,
        whatsapp: (this as any).isEnabledHosts(WHATSAPP_HOSTS) as boolean
      },
      all_hosts: (this as any).isEnabledAllHosts() as boolean
    };
  },
  created() {
    (this as any).checkPermission();
  },
  watch: {
    hosts: {
      handler(hosts: object) {
        let keys = _.keys(hosts);
        let isAllHostsEnbaled = _.every(keys, (host: string) => {
          return (hosts as any)[host];
        });

        if (isAllHostsEnbaled) {
          (this as any).all_hosts = true;
        } else {
          (this as any).all_hosts = false;
        }
      },
      deep: true
    },
    "hosts.twitter"(enabled: boolean) {
      if (enabled) {
        (this as any).enableHosts(TWITTER_HOSTS);
      } else {
        (this as any).disableHosts(TWITTER_HOSTS);
      }
    },
    "hosts.facebook"(enabled: boolean) {
      if (enabled) {
        (this as any).enableHosts(FACEBOOK_HOSTS);
      } else {
        (this as any).disableHosts(FACEBOOK_HOSTS);
      }
    },
    "hosts.instagram"(enabled: boolean) {
      if (enabled) {
        (this as any).enableHosts(INSTAGRAM_HOSTS);
      } else {
        (this as any).disableHosts(INSTAGRAM_HOSTS);
      }
    },
    "hosts.whatsapp"(enabled: boolean) {
      if (enabled) {
        (this as any).enableHosts(WHATSAPP_HOSTS);
      } else {
        (this as any).disableHosts(WHATSAPP_HOSTS);
      }
    }
  },
  methods: {
    open(link: string) {
      this.$electron.shell.openExternal(link);
    },
    checkPermission() {
      if (process.platform == "win32") {
        hostile.set(
          "0.0.0.0",
          "permission-test-for-temporary-purpose",
          (this as any).dontHavePermission
        );
        hostile.remove("0.0.0.0", "permission-test-for-temporary-purpose");
      } else {
        fs.access(hostile.HOSTS, fs.W_OK, (this as any).dontHavePermission);
      }
    },
    dontHavePermission(err: any) {
      if (err) {
        (this as any).permission = false;
      } else {
        (this as any).permission = true;
      }
    },
    grantPermission() {
      let options = {
        name: "Aspida"
      };

      (this as any).state.checking = true;

      switch (process.platform) {
        case "win32":
          var command = fs.readFileSync(__static + "\\win32.bat", "utf-8");
          sudo.exec(command, options, (this as any).grantPermissionFinished);
          break;
        case "darwin":
          var command = '/bin/chmod +a "`/usr/bin/whoami` allow read,write" /etc/hosts' as any;
          sudo.exec(command, options, (this as any).grantPermissionFinished);
          break;
        case "linux":
          var command = fs
            .readFileSync(__static + "/linux.sh", "utf-8")
            .replace("$1", process.env.USER)
            .replace(/\n/g, ";");
          sudo.exec(
            "/bin/sh -c '" + command + "'",
            options,
            (this as any).grantPermissionFinished
          );
          break;
        default:
          break;
      }
    },
    grantPermissionFinished(err: any, stdout: any, stderr: any) {
      if (err) throw err;
      console.log("stdout: " + stdout);
      (this as any).state.checking = false;
      (this as any).permission = true;
    },
    enableHosts(hosts: Array<string>) {
      hosts.forEach(function(host: string) {
        hostile.set("0.0.0.0", host);
      });
    },
    disableHosts(hosts: Array<string>) {
      hosts.forEach(function(host: string) {
        hostile.remove("0.0.0.0", host);
      });
    },
    toggleAllHosts(e: HTMLElementEvent<HTMLInputElement>) {
      if (e.target.checked) {
        (this as any).enableHosts(ALL_HOSTS);

        _.each(_.keys((this as any).hosts), (host: string) => {
          (this as any).hosts[host] = true;
        });
      } else {
        (this as any).disableHosts(ALL_HOSTS);

        _.each(_.keys((this as any).hosts), (host: string) => {
          (this as any).hosts[host] = false;
        });
      }
    },
    isEnabledHosts(target_hosts: Array<string>) {
      var preserveFormatting = false;

      let lines = hostile.get(preserveFormatting);
      let all_hosts = _.map(lines, function(line: Array<string>) {
        return line[1];
      });

      return _.every(target_hosts, function(host: string) {
        return all_hosts.includes(host);
      });
    },
    isEnabledAllHosts(): boolean {
      var preserveFormatting = false;

      let lines = hostile.get(preserveFormatting);
      let hosts = _.map(lines, function(line: Array<string>) {
        return line[1];
      });

      return _.every(ALL_HOSTS, function(host: string) {
        return hosts.includes(host);
      });
    }
  }
});
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

header {
  padding: 10px 10px;
}

footer {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.icon-gray {
  color: #333;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 90vh;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px 60px 80px;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}

.switch {
  font-size: 1rem;
  position: relative;
}
.switch input {
  position: absolute;
  height: 1px;
  width: 1px;
  background: none;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  overflow: hidden;
  padding: 0;
}
.switch input + label {
  position: relative;
  min-width: calc(calc(2.375rem * 0.8) * 2);
  border-radius: calc(2.375rem * 0.8);
  height: calc(2.375rem * 0.8);
  line-height: calc(2.375rem * 0.8);
  display: inline-block;
  cursor: pointer;
  outline: none;
  user-select: none;
  vertical-align: middle;
  /* text-indent: calc(calc(calc(2.375rem * 0.8) * 2) + 0.5rem); */
  text-indent: calc(calc(calc(1rem * 0.8) * 2) + 0.5rem);
}
.switch input + label::before,
.switch input + label::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: calc(calc(2.375rem * 0.8) * 2);
  bottom: 0;
  display: block;
}
.switch input + label::before {
  right: 0;
  background-color: #dee2e6;
  border-radius: calc(2.375rem * 0.8);
  transition: 0.2s all;
}
.switch input + label::after {
  top: 2px;
  left: 2px;
  width: calc(calc(2.375rem * 0.8) - calc(2px * 2));
  height: calc(calc(2.375rem * 0.8) - calc(2px * 2));
  border-radius: 50%;
  background-color: white;
  transition: 0.2s all;
}
.switch input:checked + label::before {
  background-color: #08d;
}
.switch input:checked + label::after {
  margin-left: calc(2.375rem * 0.8);
}
.switch input:focus + label::before {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 136, 221, 0.25);
}
.switch input:disabled + label {
  color: #868e96;
  cursor: not-allowed;
}
.switch input:disabled + label::before {
  background-color: #e9ecef;
}
.switch.switch-sm {
  font-size: 0.875rem;
}
.switch.switch-sm input + label {
  min-width: calc(calc(1.9375rem * 0.8) * 2);
  height: calc(1.9375rem * 0.8);
  line-height: calc(1.9375rem * 0.8);
  text-indent: calc(calc(calc(1.9375rem * 0.8) * 2) + 0.5rem);
}
.switch.switch-sm input + label::before {
  width: calc(calc(1.9375rem * 0.8) * 2);
}
.switch.switch-sm input + label::after {
  width: calc(calc(1.9375rem * 0.8) - calc(2px * 2));
  height: calc(calc(1.9375rem * 0.8) - calc(2px * 2));
}
.switch.switch-sm input:checked + label::after {
  margin-left: calc(1.9375rem * 0.8);
}
.switch.switch-lg {
  font-size: 1.25rem;
}
.switch.switch-lg input + label {
  min-width: calc(calc(3rem * 0.8) * 2);
  height: calc(3rem * 0.8);
  line-height: calc(3rem * 0.8);
  text-indent: calc(calc(calc(3rem * 0.8) * 2) + 0.5rem);
}
.switch.switch-lg input + label::before {
  width: calc(calc(3rem * 0.8) * 2);
}
.switch.switch-lg input + label::after {
  width: calc(calc(3rem * 0.8) - calc(2px * 2));
  height: calc(calc(3rem * 0.8) - calc(2px * 2));
}
.switch.switch-lg input:checked + label::after {
  margin-left: calc(3rem * 0.8);
}
.switch + .switch {
  margin-left: 1rem;
}

body {
  padding: 1rem;
}

.dropdown-menu {
  margin-top: 0.75rem;
}
</style>
