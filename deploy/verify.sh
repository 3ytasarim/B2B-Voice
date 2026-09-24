#!/usr/bin/env bash
# Acceptance checks from the SEO list (section 22). Usage: verify.sh <base-url>
BASE="${1:-http://127.0.0.1:8081}"
PASS=0
FAIL=0
ok()  { echo "  OK   $1"; PASS=$((PASS+1)); }
bad() { echo "  FAIL $1"; FAIL=$((FAIL+1)); }
check() { if eval "$2" >/dev/null 2>&1; then ok "$1"; else bad "$1"; fi; }
code() { curl -s -o /dev/null -w '%{http_code}' "$1"; }
A="what-is-b2b-voice"
TITLE="What Is B2B Voice and What Does It Do"

echo "== first HTML contains real content"
check "home has H1"                     "curl -s $BASE/ | grep -q '<h1'"
check "blog lists article links"        "curl -s $BASE/blog | grep -q 'href=\"/$A\"'"
check "article has title + body text"   "curl -s $BASE/$A | grep -q '$TITLE'"
check "article has JSON-LD BlogPosting" "curl -s $BASE/$A | grep -q BlogPosting"
check "article canonical is self"       "curl -s $BASE/$A | grep -q 'rel=\"canonical\" href=\"https://b2b-voice.com/$A\"'"
check "article: exactly one h1"         "[ \$(curl -s $BASE/$A | grep -o '<h1' | wc -l) -eq 1 ]"
check "article: exactly one article"    "[ \$(curl -s $BASE/$A | grep -o '<article' | wc -l) -eq 1 ]"
check "titles differ (home vs blog)"    "[ \"\$(curl -s $BASE/ | grep -o '<title>[^<]*')\" != \"\$(curl -s $BASE/blog | grep -o '<title>[^<]*')\" ]"
check "no maximum-scale in viewport"    "! curl -s $BASE/ | grep -q maximum-scale"

echo "== AI crawlers get the same content"
for UA in "OAI-SearchBot/1.4; +https://openai.com/searchbot" "Claude-SearchBot" "Googlebot"; do
  check "UA $UA gets article text"      "curl -s -A '$UA' $BASE/$A | grep -q '$TITLE'"
done
check "robots.txt lists OAI-SearchBot"  "curl -s $BASE/robots.txt | grep -q OAI-SearchBot"
check "robots.txt has Sitemap line"     "curl -s $BASE/robots.txt | grep -q '^Sitemap: https://b2b-voice.com/sitemap.xml'"

echo "== sitemap"
check "sitemap content-type is XML"     "curl -sI $BASE/sitemap.xml | grep -i '^content-type:' | grep -qi xml"
check "sitemap is a urlset"             "curl -s $BASE/sitemap.xml | grep -q '<urlset'"
check "sitemap lists blog + article"    "curl -s $BASE/sitemap.xml | grep -q 'b2b-voice.com/blog</loc>' && curl -s $BASE/sitemap.xml | grep -q '$A</loc>'"

echo "== status codes"
check "unknown URL -> 404"              "[ \$(code $BASE/this-page-should-not-exist-audit-2026) = 404 ]"
check "/blog/ -> 301"                   "[ \$(code $BASE/blog/) = 301 ]"
check "/blog.html -> 301"               "[ \$(code $BASE/blog.html) = 301 ]"
check "/index.html -> 301"              "[ \$(code $BASE/index.html) = 301 ]"
check "/admin has noindex header"       "curl -sI $BASE/admin | grep -qi 'x-robots-tag: noindex'"
check "/api/ is proxied, not HTML"      "! curl -s $BASE/api/blog | grep -q '<html'"

echo "== compression and caching"
ASSET=$(curl -s "$BASE/" | grep -o '/assets/app-[^"]*\.js' | head -1)
check "HTML is gzip-compressed"         "curl -sI -H 'Accept-Encoding: gzip' $BASE/ | grep -qi 'content-encoding: gzip'"
check "HTML revalidates (no-cache)"     "curl -sI $BASE/ | grep -i '^cache-control:' | grep -qi no-cache"
check "hashed asset is immutable"       "curl -sI $BASE$ASSET | grep -i '^cache-control:' | grep -qi immutable"
check "fonts cached for 30 days"        "curl -sI $BASE/fonts/bricolage-grotesque-latin.woff2 | grep -i '^cache-control:' | grep -q 2592000"
check "OG card is served as image/jpeg" "curl -sI $BASE/og/home.jpg | grep -i '^content-type:' | grep -qi image/jpeg"

case "$BASE" in
  https://b2b-voice.com*)
    echo "== domain redirects (production only)"
    check "https://www -> 301 to apex"  "curl -sI https://www.b2b-voice.com/ | head -1 | grep -q 301 && curl -sI https://www.b2b-voice.com/ | grep -qi '^location: https://b2b-voice.com/'"
    check "http://www -> single 301"    "curl -sI http://www.b2b-voice.com/ | grep -qi '^location: https://b2b-voice.com/'"
    check "http://apex -> 301 https"    "curl -sI http://b2b-voice.com/ | grep -qi '^location: https://b2b-voice.com/'"
    ;;
esac

echo
echo "passed: $PASS  failed: $FAIL"
[ "$FAIL" -eq 0 ]
