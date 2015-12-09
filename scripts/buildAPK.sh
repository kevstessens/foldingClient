#!/bin/bash
#

export PATH=/usr/local/bin:$PATH

BUILD_VERSION=$1
BRANCH=$2

echo "=== STARTING APK BUILD ==="
echo ""
echo ""
echo ""

APP_ID="$(gulp config --silent --getId)"
APP_VERSION="$(gulp config --silent --getVersion)"
gulp config --setId="${APP_ID}-${BRANCH}"
gulp config --setVersion="${APP_VERSION}.${BUILD_VERSION}"

rm -rf platforms/android/build/outputs/apk/
rm -rf www/

ionic browser add crosswalk
ionic resources

gulp --cordova "prepare"

if [[ $BRANCH == master ]]; then
gulp config --setName="Genesis Mobile Desa"
gulp --cordova "build android" --env=desa
fi

if [[ $BRANCH == release_candidate ]]; then
gulp config --setName="Genesis Mobile Test"
gulp --cordova "build android" --env=test
fi

if [[ $BRANCH == release ]]; then
gulp config --setName="Genesis Mobile"
gulp --cordova "build android" --env=prod
fi

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

  if [ -e "platforms/android/build/outputs/apk/android-debug.apk" ]; then
    mv platforms/android/build/outputs/apk/android-armv7-debug.apk genesisMobile-armv7.apk
    echo "ARMV7 Version moved"
    echo "=== FIND APK AT /genesisMobile-armv7.apk ==="
  fi
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

echo ""
echo ""
echo ""
echo "=== TAGGING AND PUSHING APK ==="
echo ""
echo ""
echo ""

git config --global push.default simple
rm -rf distribution-genesis-mobile
git clone --depth 1 -b $BRANCH ssh://git@git.tekgenesis.com/repositories/distribution-genesis-mobile.git distribution-genesis-mobile
mv genesisMobile.apk distribution-genesis-mobile/genesisMobile.apk
cd distribution-genesis-mobile/
git config --global user.email "teamcity-mobile@tekgenesis.com"
git add --all .
git commit -m "Genesis-mobile $APP_VERSION.$BUILD_VERSION"
git push
TAG=$BRANCH-$BUILD_VERSION
echo $TAG
git tag $TAG
git push --tags
cd ..
gulp config --setId="${APP_ID}"
gulp config --setVersion="${APP_VERSION}"
