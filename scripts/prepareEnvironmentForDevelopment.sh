#!/bin/bash
#

echo "=== CONFIGURATION OF ENVIRONMENT FOR GENESIS MOBILE ==="
echo ""
echo ""
echo ""
cd ..

if test ! $(which brew); then
  echo "Installing homebrew..."
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  export PATH="/usr/local/bin:$PATH"
fi

echo ""
echo ""
echo ""
echo "=== HOMEBREW CONFIGURATION ==="
echo ""
echo ""
echo ""

# Update homebrew recipes
echo "Updating homebrew..."
brew update


echo ""
echo ""
echo ""
echo "=== NPM CONFIGURATION ==="
echo ""
echo ""
echo ""


if test ! $(which npm); then
  echo "Installing npm..."
  brew install node
  echo " node and npm are installed"
fi

if test ! $(which android); then
  echo "Installing android SDK..."
  brew install android-sdk
  echo " SDK installed"
fi

echo " Updating SDK"

expect -c '
set timeout -1   ;
spawn android update sdk -u;
expect {
    "Do you accept the license" { exp_send "y\r" ; exp_continue }
    eof
}
'

echo "running npm install"
npm install


echo ""
echo ""
echo ""
echo "=== BOWER CONFIGURATION ==="
echo ""
echo ""
echo ""

if test ! $(which cordova); then
  echo "Installing cordova..."
  npm install -g cordova
  echo " cordova is installed"
fi

if test ! $(which bower); then
  echo "Installing bower..."
  npm install -g bower
  echo " bower is installed"
fi

echo "running bower install"
bower install

if test ! $(which ionic); then
  echo "Installing ionic..."
  npm install -g ionic
  echo " ionic is installed"
fi

ionic browser add crosswalk


echo ""
echo ""
echo ""
echo "=== SASS CONFIGURATION ==="
echo ""
echo ""
echo ""

npm install node-sass@3.3.3
npm -g install node-gyp@3
npm uninstall gulp-sass
npm install gulp-sass@2
npm rebuild node-sass
ionic setup sass

echo ""
echo ""
echo ""
echo "=== GULP CONFIGURATION ==="
echo ""
echo ""
echo ""


if test ! $(which gulp); then
  echo "Installing gulp..."
  npm install -g gulp
  echo " gulp is installed"
fi


echo ""
echo ""
echo ""
echo "=== CONFIGURATION OF ENVIRONMENT ENDED ==="
echo ""
echo ""
echo ""
echo "=== STARTING APK BUILD ==="
echo ""
echo ""
echo ""

gulp --cordova "prepare"
gulp --cordova "build android"

echo ""
echo ""
echo ""
echo "=== CORDOVA CONFIG ENDED - APK BUILT ==="
echo ""
echo ""
echo ""

echo "=== MOVING APK ==="
echo ""
echo ""
echo ""

if [ -e "platforms/android/build/outputs/apk/android-armv7-debug.apk" ]; then
  if ! [ -e "platforms/android/build/outputs/apk/android-debug.apk" ]; then
    mv platforms/android/build/outputs/apk/android-armv7-debug.apk genesisMobile.apk
    echo "Default Version moved"
    echo "=== FIND APK AT /genesisMobile.apk ==="
  fi
  mv platforms/android/build/outputs/apk/android-armv7-debug.apk genesisMobile-armv7.apk
  echo "ARMV7 Version moved"
  echo "=== FIND APK AT /genesisMobile-armv7.apk ==="
fi

if [ -e "platforms/android/build/outputs/apk/android-x86-debug.apk" ]; then
  mv platforms/android/build/outputs/apk/android-x86-debug.apk genesisMobile-x86.apk
  echo "x86 Version moved"
  echo "=== FIND APK AT /genesisMobile-x86.apk ==="
fi

if [ -e "platforms/android/build/outputs/apk/android-debug.apk" ]; then
  mv platforms/android/build/outputs/apk/android-debug.apk genesisMobile.apk
  echo "Default Version moved"
  echo "=== FIND APK AT /genesisMobile.apk ==="
fi

