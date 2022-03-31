#　AWS Amplify コントリビューターリストのリポジトリ

## 開発ガイド

`npm install` を実行して依存パッケージをダウンロード
`npm run fetch` を実行してコントリビューターのリストを更新

### GitHub Access Token

コントリビューターのリストを作成するために GitHub API を使用します。`npm run fetch`を繰り返すと GitHub API のレート制限に該当して API 呼び出しが制限される場合があります。
その場合、[個人アクセストークンを使用する](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-token)
に従いアクセストークンを発行して以下のように `GITHUB_TOKEN` 環境変数で指定して実行してください。

```sh
GITHUB_TOKEN=<personal access token> npm run fetch
```
