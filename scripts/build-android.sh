#!/bin/bash
set -e

echo "=== RAzy Android Native APK & AAB Compilation Pipeline ==="

ANDROID_JAR="/opt/android-sdk/platforms/android-30/android.jar"
R8_JAR="/opt/android-sdk/r8.jar"
BUNDLETOOL_JAR="/opt/android-sdk/bundletool.jar"
KEYSTORE="/opt/android-sdk/razy-release.keystore"
KEY_ALIAS="razy"
KEY_PASS="razy123"

PUBLIC_DOWNLOADS="/app/applet/public/downloads"
mkdir -p "$PUBLIC_DOWNLOADS"

WORK_DIR="/tmp/razy-android-build"
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR/src/com/razy/launcher"
mkdir -p "$WORK_DIR/res/values"
mkdir -p "$WORK_DIR/res/drawable"
mkdir -p "$WORK_DIR/res/mipmap-mdpi"
mkdir -p "$WORK_DIR/res/mipmap-hdpi"
mkdir -p "$WORK_DIR/res/mipmap-xhdpi"
mkdir -p "$WORK_DIR/res/mipmap-xxhdpi"
mkdir -p "$WORK_DIR/res/mipmap-xxxhdpi"
mkdir -p "$WORK_DIR/assets"
mkdir -p "$WORK_DIR/bin"
mkdir -p "$WORK_DIR/dex"

echo ">> 1. Creating AndroidManifest.xml..."
cat << 'EOF' > "$WORK_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.razy.launcher"
    android:versionCode="10001"
    android:versionName="1.0.1">

    <uses-sdk
        android:minSdkVersion="23"
        android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <uses-feature
        android:name="android.hardware.touchscreen"
        android:required="false" />
    <uses-feature
        android:name="android.software.leanback"
        android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_launcher"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/AppTheme">

        <activity
            android:name="com.razy.launcher.MainActivity"
            android:configChanges="orientation|screenSize|screenLayout|smallestScreenSize|keyboardHidden|keyboard"
            android:exported="true"
            android:hardwareAccelerated="true"
            android:launchMode="singleTask"
            android:screenOrientation="sensorLandscape">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="razy" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

echo ">> 2. Generating Android Resources & Icons..."
cat << 'EOF' > "$WORK_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">RAzy Launcher</string>
</resources>
EOF

cat << 'EOF' > "$WORK_DIR/res/values/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.NoTitleBar.Fullscreen">
        <item name="android:windowBackground">@android:color/black</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>
</resources>
EOF

cp /app/applet/public/icons/icon-192.png "$WORK_DIR/res/drawable/ic_launcher.png"
cp /app/applet/public/icons/icon-192.png "$WORK_DIR/res/mipmap-mdpi/ic_launcher.png"
cp /app/applet/public/icons/icon-192.png "$WORK_DIR/res/mipmap-hdpi/ic_launcher.png"
cp /app/applet/public/icons/icon-192.png "$WORK_DIR/res/mipmap-xhdpi/ic_launcher.png"
cp /app/applet/public/icons/icon-512.png "$WORK_DIR/res/mipmap-xxhdpi/ic_launcher.png"
cp /app/applet/public/icons/icon-512.png "$WORK_DIR/res/mipmap-xxxhdpi/ic_launcher.png"

echo ">> 3. Creating Offline Fallback HTML inside assets..."
cat << 'EOF' > "$WORK_DIR/assets/offline.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>RAzy Launcher — Offline</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #020617;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      overflow: hidden;
    }
    .card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.3);
      box-shadow: 0 0 40px rgba(56, 189, 248, 0.15);
      border-radius: 20px;
      padding: 32px 40px;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h1 {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 40%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .btn {
      margin-top: 8px;
      padding: 12px 28px;
      border-radius: 12px;
      background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(56, 189, 248, 0.35);
      transition: transform 0.1s, opacity 0.1s;
    }
    .btn:active { transform: scale(0.97); }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">📡 RAzy Standalone Android App</div>
    <h1>Connection Needed</h1>
    <p>RAzy requires an active internet connection to stream match servers and player data. Check your Wi-Fi or mobile data.</p>
    <button class="btn" onclick="window.location.reload()">🔄 Reconnect Now</button>
  </div>
  <script>
    window.addEventListener('online', () => {
      window.location.reload();
    });
    setInterval(() => {
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 4000);
  </script>
</body>
</html>
EOF

echo ">> 4. Generating MainActivity.java..."
cat << 'EOF' > "$WORK_DIR/src/com/razy/launcher/MainActivity.java"
package com.razy.launcher;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {
    private static final String DEFAULT_URL = "https://ais-dev-sbkrktmyq7bi2fnwsmm4ie-176475984521.asia-east1.run.app/";
    private static final String OFFLINE_FALLBACK = "file:///android_asset/offline.html";

    private WebView mWebView;
    private FrameLayout mContainer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Force Landscape & Fullscreen Immersive Window
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);

        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        window.addFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);

        mContainer = new FrameLayout(this);
        mContainer.setBackgroundColor(Color.BLACK);
        setContentView(mContainer);

        // 2. Initialize Hardware Accelerated WebView
        mWebView = new WebView(this);
        mWebView.setLayoutParams(new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
        mWebView.setBackgroundColor(Color.BLACK);
        mWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        configureWebSettings(mWebView.getSettings());
        configureWebClients(mWebView);

        mContainer.addView(mWebView);

        // 3. Apply Immersive Sticky UI
        applyImmersiveMode();

        // 4. Resolve Target URL
        String targetUrl = resolveTargetUrl(getIntent());
        mWebView.loadUrl(targetUrl);
    }

    private void configureWebSettings(WebSettings settings) {
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    }

    private void configureWebClients(WebView webView) {
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                // Automatically grant required media permissions (audio, video, etc.)
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url != null && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("file:///"))) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (Exception ignored) {}
                return true;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    return shouldOverrideUrlLoading(view, request.getUrl().toString());
                }
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (request.isForMainFrame()) {
                        view.loadUrl(OFFLINE_FALLBACK);
                    }
                }
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                if (errorCode == ERROR_HOST_LOOKUP || errorCode == ERROR_CONNECT || errorCode == ERROR_TIMEOUT) {
                    view.loadUrl(OFFLINE_FALLBACK);
                }
            }
        });
    }

    private void applyImmersiveMode() {
        View decorView = getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN;
        decorView.setSystemUiVisibility(uiOptions);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyImmersiveMode();
        }
    }

    private String resolveTargetUrl(Intent intent) {
        if (intent != null && intent.getData() != null) {
            String uriStr = intent.getData().toString();
            if (uriStr.startsWith("http://") || uriStr.startsWith("https://")) {
                return uriStr;
            }
        }
        return DEFAULT_URL;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (mWebView != null) {
            String url = resolveTargetUrl(intent);
            mWebView.loadUrl(url);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (mWebView != null && mWebView.canGoBack()) {
                mWebView.goBack();
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onPause() {
        if (mWebView != null) {
            mWebView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mWebView != null) {
            mWebView.onResume();
        }
        applyImmersiveMode();
    }

    @Override
    protected void onDestroy() {
        if (mWebView != null) {
            mWebView.destroy();
        }
        super.onDestroy();
    }
}
EOF

echo ">> 5. Compiling Java Source..."
javac -encoding UTF-8 \
      -cp "$ANDROID_JAR" \
      -d "$WORK_DIR/bin" \
      "$WORK_DIR/src/com/razy/launcher/MainActivity.java"

echo ">> 6. Running D8 to create classes.dex..."
CLASS_FILES=$(find "$WORK_DIR/bin" -name "*.class")
java -cp "$R8_JAR" com.android.tools.r8.D8 \
     --lib "$ANDROID_JAR" \
     --release \
     --output "$WORK_DIR/dex" \
     $CLASS_FILES

test -f "$WORK_DIR/dex/classes.dex" || { echo "D8 dexing failed!"; exit 1; }

echo ">> 7. Packaging APK Resources with AAPT..."
aapt package -f -m \
     -J "$WORK_DIR/src" \
     -M "$WORK_DIR/AndroidManifest.xml" \
     -S "$WORK_DIR/res" \
     -A "$WORK_DIR/assets" \
     -I "$ANDROID_JAR" \
     -F "$WORK_DIR/unaligned.apk"

echo ">> 8. Adding classes.dex to APK..."
cd "$WORK_DIR/dex"
zip -u "$WORK_DIR/unaligned.apk" classes.dex
cd - > /dev/null

echo ">> 9. Aligning APK with zipalign..."
zipalign -f -p 4 "$WORK_DIR/unaligned.apk" "$WORK_DIR/aligned.apk"

echo ">> 10. Signing APK with apksigner (v1, v2, v3)..."
apksigner sign \
     --ks "$KEYSTORE" \
     --ks-pass "pass:$KEY_PASS" \
     --ks-key-alias "$KEY_ALIAS" \
     --out "$PUBLIC_DOWNLOADS/razy-launcher.apk" \
     "$WORK_DIR/aligned.apk"

echo ">> 11. Verifying APK signature..."
apksigner verify -v "$PUBLIC_DOWNLOADS/razy-launcher.apk"

echo ">> 12. Compiling AAB (Android App Bundle)..."
# Compile resources to flat files
mkdir -p "$WORK_DIR/compiled_res"
aapt2 compile --dir "$WORK_DIR/res" -o "$WORK_DIR/compiled_res/res.zip"

# Link with proto format for AAB
aapt2 link --proto-format \
      -o "$WORK_DIR/base_proto.apk" \
      -I "$ANDROID_JAR" \
      --manifest "$WORK_DIR/AndroidManifest.xml" \
      "$WORK_DIR/compiled_res/res.zip" \
      --auto-add-overlay

# Assemble base module directory structure for bundletool
mkdir -p "$WORK_DIR/bundle_module/manifest"
mkdir -p "$WORK_DIR/bundle_module/dex"
mkdir -p "$WORK_DIR/bundle_module/res"
mkdir -p "$WORK_DIR/bundle_module/root"
mkdir -p "$WORK_DIR/bundle_module/assets"

unzip -q -o "$WORK_DIR/base_proto.apk" -d "$WORK_DIR/proto_extracted"
cp "$WORK_DIR/proto_extracted/AndroidManifest.xml" "$WORK_DIR/bundle_module/manifest/"
if [ -f "$WORK_DIR/proto_extracted/resources.pb" ]; then
    cp "$WORK_DIR/proto_extracted/resources.pb" "$WORK_DIR/bundle_module/"
fi
if [ -d "$WORK_DIR/proto_extracted/res" ]; then
    cp -r "$WORK_DIR/proto_extracted/res" "$WORK_DIR/bundle_module/"
fi
cp "$WORK_DIR/dex/classes.dex" "$WORK_DIR/bundle_module/dex/"
cp -r "$WORK_DIR/assets"/* "$WORK_DIR/bundle_module/assets/"

cd "$WORK_DIR/bundle_module"
zip -q -r "$WORK_DIR/base.zip" *
cd - > /dev/null

echo ">> 13. Building AAB with Bundletool..."
java -jar "$BUNDLETOOL_JAR" build-bundle \
     --modules="$WORK_DIR/base.zip" \
     --output="$WORK_DIR/razy-launcher-unsigned.aab"

echo ">> 14. Signing AAB with jarsigner..."
jarsigner -keystore "$KEYSTORE" \
          -storepass "$KEY_PASS" \
          "$WORK_DIR/razy-launcher-unsigned.aab" \
          "$KEY_ALIAS"

mv "$WORK_DIR/razy-launcher-unsigned.aab" "$PUBLIC_DOWNLOADS/razy-launcher.aab"

echo ">> 15. Validating AAB bundle..."
java -jar "$BUNDLETOOL_JAR" validate --bundle="$PUBLIC_DOWNLOADS/razy-launcher.aab"

echo "=== BUILD SUCCESSFUL ==="
ls -lh "$PUBLIC_DOWNLOADS/razy-launcher.apk" "$PUBLIC_DOWNLOADS/razy-launcher.aab"
