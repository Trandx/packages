# Supprimer le dossier et créer un lien symbolique vers l'emplacement externe
ln -s path/to/package_name packages_alias

# Ajouter le submodule dans un dossier local valide
git submodule add  https://github.com/user/vue-cropper.git path/to/package_name packages_alias


### 1. Remove the Existing Directory from Git Index
Since `vue-cropper` is already in the Git index, but not as a submodule, you need to untrack it while keeping the directory contents intact.

Run the following command:
```bash
git rm --cached path/to/vue-cropper
```

This will unstage the `vue-cropper` folder without deleting its files from your working directory.

### 2. Add `vue-cropper` as a Submodule
Now that `vue-cropper` has been removed from the index, you can add it as a submodule:
```bash
git submodule add https://github.com/user/vue-cropper.git path/to/vue-cropper
```

Make sure to replace the URL and path with the correct ones.

### 3. Initialize and Update the Submodule
After adding the submodule, initialize and update it:
```bash
git submodule init
git submodule update
```
### 4.Verify Everything Works
Check if the submodule is properly set up:
```bash
git submodule
```

### 5. Commit the Changes
Finally, commit the changes and push:
```bash
git commit -m "Add vue-cropper as a submodule"
git push origin branch-name
```

This should resolve the issue of the submodule already existing in the index. Let me know if you run into any issues!