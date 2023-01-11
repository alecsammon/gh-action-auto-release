# Auto Release

When merging a PR into `main` then this will automatically create a semantic release.

Each PR should have a label of `release:major`, `release:minor`, `release:patch` or `release:none`

## Inputs

### `github-token`

**Required** The github-token from `secrets.GITHUB_TOKEN`

## Example usage

```yaml
uses: alecsammon/gh-action-auto-release@{{ tag }}
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
```
