![](assets/thumbnail.jpg)

# Le Hachage en C : Plongée au cœur du SHA-256 et MD5

Vous êtes-vous déjà demandé ce qui assure la sécurité de votre monde en ligne ? De vos transactions bancaires à vos mots de passe, les héros méconnus sont les fonctions de hachage cryptographiques. Aujourd'hui, je lève le voile sur deux grands noms du domaine : MD5 et SHA-256. Nous ne parlerons pas seulement de théorie ; nous allons mettre les mains dans le code C.

J'ai même inclus un lien vers un dépôt GitHub avec l'implémentation complète. Prêt à passer au niveau supérieur en crypto ? C'est parti.

[Explorez le royaume magique des fonctions de hachage dans notre dépôt GitHub](https://github.com/jterrazz/42-ssl-md5?source=post_page-----78c17e657794--------------------------------)

## Fonctions cryptographiques : les gardiens silencieux de votre vie numérique

Voyez les fonctions cryptographiques comme le champ de force invisible de l'univers numérique. Elles travaillent constamment en coulisses pour :

- **Garantir l'intégrité des données**, en s'assurant que les fichiers et messages que vous envoyez et recevez sont exactement tels qu'ils ont été conçus.
- **Vérifier les mots de passe de manière sécurisée** sans jamais stocker le texte brut.
- Alimenter la **"preuve de travail" (proof of work)** qui est fondamentale pour les cryptomonnaies comme le Bitcoin et l'Ethereum.
- Permettre les **signatures numériques**, qui sont l'équivalent en ligne d'une signature juridiquement contraignante.

Ces centrales numériques prennent n'importe quelle entrée que vous leur donnez, d'un simple caractère à un fichier massif, et la réduisent en une chaîne de caractères de longueur fixe appelée un hash (ou empreinte). C'est comme créer une empreinte digitale unique pour vos données.

- **MD5** crache un hash de 128 bits (soit 32 caractères hexadécimaux).
- **SHA-256** crée un hash de 256 bits (64 caractères hexadécimaux).

![Visualisation de Fonction de Hachage](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZh9gQlawdGcwSrCO0KOeA.png)

### Les super-pouvoirs d'une fonction de hachage solide

Une bonne fonction de hachage possède quelques propriétés clés qui en font un couteau suisse cryptographique :

1. **Déterminisme** : Même entrée, même sortie. À chaque fois.
2. **Vitesse** : Elles sont conçues pour la vitesse, calculant les hashs en un éclair.
3. **Irréversibilité (One-wayness)** : Vous ne pouvez pas retrouver l'entrée à partir du hash. C'est une rue à sens unique.
4. **Résistance aux collisions** : Il est pratiquement impossible de trouver deux entrées différentes qui créent le même hash.
5. **Effet avalanche** : Changez un seul bit dans l'entrée, et le hash de sortie change de manière radicale et imprévisible.

## Le match principal : MD5 vs SHA-256

### MD5 : le vétéran (qui devrait être à la retraite)

MD5 a été un cheval de trait à son époque, mais son temps est révolu. On lui a découvert des vulnérabilités significatives, particulièrement aux "attaques par collision", où différentes entrées peuvent produire le même hash. Cela le rend inadapté pour tout ce qui touche à la sécurité.

Alors, où pourriez-vous encore voir du MD5 ?

- Comme une simple somme de contrôle (checksum) pour vérifier l'intégrité d'un fichier contre la corruption accidentelle.
- Dans des systèmes hérités (legacy) ou des applications non critiques pour la sécurité où la vitesse est la seule préoccupation.

**Conclusion : N'utilisez pas MD5 pour la sécurité.** C'est comme amener un couteau dans une fusillade.

### SHA-256 : le standard moderne

SHA-256 fait partie de la famille SHA-2, conçue par la NSA pour succéder à SHA-1 (qui s'est aussi révélé vulnérable). C'est aujourd'hui le standard de l'industrie pour une vaste gamme d'applications.

SHA-256 est considéré comme sûr car :

- Inverser le hash pour trouver l'entrée originale est calculatoirement irréalisable.
- Il a une forte résistance aux collisions, rendant incroyablement difficile de trouver deux entrées avec le même hash.

Cependant, même avec ses forces, je ne recommanderais pas d'utiliser SHA-256 "brut" pour stocker des mots de passe. Sa vitesse pure peut le rendre vulnérable aux attaques par force brute. Pour le hachage de mots de passe, des algorithmes plus lents et complexes comme Bcrypt ou Scrypt sont la voie à suivre.

## Sous le capot : comment la magie opère

### Étape 1 : préparer le message

Avant qu'une fonction de hachage puisse opérer sa magie, le message d'entrée doit être préparé et "rembourré" (padding) selon une formule stricte :

1. Le message est découpé en **blocs de 512 bits**.
2. Un unique bit '1' est ajouté à la fin du message.
3. Des bits '0' sont ajoutés jusqu'à ce que la longueur du message soit à 64 bits d'un multiple de 512.
4. Les 64 derniers bits sont utilisés pour stocker la longueur du message original.

![Formatage du Message](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6Lplvsky40XwCE3zBhsjOA.png)
_La taille du message formaté doit être un multiple de 512 bits_

Voici un aperçu de comment vous pourriez construire ce message formaté en C :

```c
unsigned char *build_msg(const char *msg, size_t msg_len, size_t formatted_msg_len, bool is_little_endian)
{
  unsigned char  *formatted_msg;
  size_t         cursor;

  if (!(formatted_msg = malloc(formatted_msg_len)))
    return (NULL);

  ft_memcpy(formatted_msg, msg, msg_len);
  formatted_msg[msg_len] = 0b10000000;
  cursor = msg_len + 1;

  while (cursor < formatted_msg_len - 8)
    formatted_msg[cursor++] = 0;

  *(uint64_t *)(formatted_msg + formatted_msg_len - 8) =
    is_little_endian ? (8 * msg_len) : ft_bswap_uint64(8 * msg_len);

  return (formatted_msg);
}
```

Pour obtenir la longueur du message formaté, vous pouvez utiliser une astuce binaire sympa pour aligner la longueur sur un multiple de 'X' octets :

```c
aligned = (nb + (X - 1)) & ~(X - 1);
```

Dans notre code, ça ressemble à quelque chose comme ça :

```c
#define DEC(x) (x - 1)

// Blocs de 512 bits
#define MD5_CHUNK_SIZE 64

// +1 pour le '1' ajouté
// +8 pour la taille en 64 bits
#define MD5_CHUNKS_SIZE(len) ((len + 1 + 8 + DEC(MD5_CHUNK_SIZE)) & \
~DEC(MD5_CHUNK_SIZE))
#define MD5_CHUNK_COUNT(len) (MD5_CHUNKS_SIZE(len) / MD5_CHUNK_SIZE)

formatted_msg_len = CHUNK_SIZE * CHUNK_COUNT;
```

### Le duel Big vs. Little Endian

Avant d'aller plus loin, un petit mot sur l'endianness (boutisme). Tout est question d'ordre des octets dans la mémoire de l'ordinateur.

- **Little-endian** : L'octet de poids faible est stocké en premier.
- **Big-endian** : L'octet de poids fort arrive en premier.

[Plongez plus profondément dans le terrier de l'endianness](https://medium.com/@nonuruzun/little-big-endian-dc9abe36270?source=post_page-----78c17e657794--------------------------------)

Pour basculer entre eux, nous pouvons utiliser une fonction d'échange d'octets (byte-swapping) :

```c
uint64_t  ft_bswap_uint64(uint64_t x)
{
  x = ((x << 8) & 0xFF00FF00FF00FF00ULL) | ((x >> 8) & 0x00FF00FF00FF00FFULL);
  x = ((x << 16) & 0xFFFF0000FFFF0000ULL) | ((x >> 16) &
0x0000FFFF0000FFFFULL);

  return (x << 32) | (x >> 32);
}
```

Cette fonction mélange les octets selon un motif astucieux et expansif.

![Mélange d'octets](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i8YyrTUB3CcCpwK2PacC5g.png)

### Étape 2 : la boucle de traitement principale

C'est là que le gros du travail se fait. Les deux algorithmes traitent le message par blocs de 512 bits, mais ils utilisent un nombre différent de tampons (buffers) internes :

- MD5 : 4 x tampons de 32 bits
- SHA-256 : 8 x tampons de 32 bits

Ces tampons sont initialisés avec des valeurs spécifiques puis mis à jour à travers une série de tours (rounds). Chaque tour implique un mélange complexe d'opérations binaires (bitwise), d'additions modulaires et de fonctions non linéaires personnalisées.

Pour ceux qui veulent voir les entrailles des algorithmes :

- [Plongée dans l'algorithme MD5](https://en.wikipedia.org/wiki/MD5?source=post_page-----78c17e657794--------------------------------#Pseudocode)
- [L'algorithme SHA-256 expliqué](https://en.wikipedia.org/wiki/SHA-2?source=post_page-----78c17e657794--------------------------------#Pseudocode)

Ou, consultez le code C directement :

- [Implémentation SHA-256](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_sha256/sha256.c)
- [Implémentation MD5](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_md5/md5.c)

### Le grand final : assemblage du hash

Après que chaque bloc a été traité, les valeurs finales dans les tampons sont concaténées pour former le hash.

```c
char *build_hash(uint32_t *buffers, size_t buffer_count, bool is_little_endian)
{
  char      *hash;
  char      *hash_tmp;
  size_t    buffer_i;
  uint32_t  buffer;
  
  buffer_i = 0;

  if (!(hash = ft_strnew(buffer_count * 8)))
    return (NULL);

  while (buffer_i < buffer_count) {
    buffer = is_little_endian ? ft_bswap_uint32(buffers[buffer_i]) : buffers[buffer_i];

    if (!(hash_tmp = ft_uitoa_base_len(buffer, 16, 'a', 8)))
      return (NULL);

    ft_strncpy(hash + (buffer_i * 8), hash_tmp, 8);
    free(hash_tmp);
    buffer_i++;
  }
  
  return (hash);
}
```

Une dernière bizarrerie pour MD5 : ses tampons sont au format little-endian, ils doivent donc être inversés (byte-swapped) avant d'être convertis en la chaîne hexadécimale finale.

```c
uint32_t ft_bswap_uint32(uint32_t x)
{
  x = ((x << 8) & 0xFF00FF00) | ((x >> 8) & 0x00FF00FF);
  
  return (x << 16) | (x >> 16);
}
```

## Un peu perdu ?

Si les détails du SHA-256 semblent un peu denses, ne vous inquiétez pas. J'ai trouvé ce guide étape par étape génial qui décompose tout.

- [Guide étape par étape du SHA-256](https://docs.google.com/spreadsheets/d/1mOTrqckdetCoRxY5QkVcyQ7Z0gcYIH-Dc0tu7t9f7tw/edit?source=post_page-----78c17e657794--------------------------------#gid=2107569783)

## Pour conclure

Voilà, c'était un tourbillon rapide des fonctions de hachage cryptographiques. Vous avez vu ce qu'elles font, pourquoi elles sont essentielles pour la sécurité numérique, et même comment les construire de zéro.

Le monde de la cryptographie ne s'arrête jamais. Ce qui est sûr aujourd'hui pourrait être vulnérable demain. Continuez d'apprendre, continuez d'expérimenter, et peut-être serez-vous celui qui construira la prochaine génération d'algorithmes sécurisés.

Et n'oubliez pas de jouer avec le code dans le dépôt GitHub. Il n'y a pas de meilleure façon d'apprendre qu'en faisant.

Bon hachage !

