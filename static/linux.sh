groupadd hosts_editing
usermod -a -G hosts_editing root
usermod -a -G hosts_editing $1
chgrp hosts_editing /etc/hosts
chmod g+w /etc/hosts