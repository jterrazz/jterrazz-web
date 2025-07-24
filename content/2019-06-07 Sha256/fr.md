![](assets/thumbnail.jpg)

# L'art du hachage en C: un duel entre MD5 et SHA-256

Vous êtes-vous déjà demandé ce qui sécurise vraiment votre univers numérique? Derrière vos transactions bancaires et vos mots de passe se cachent des gardiens de l'ombre: les fonctions de hachage cryptographiques. Aujourd'hui, nous allons lever le voile sur deux des plus emblématiques d'entre elles, MD5 et SHA-256. Et nous n'allons pas nous contenter de théorie; nous allons mettre les mains dans le cambouis avec du code en C.

J'ai même inclus un lien vers un dépôt GitHub contenant une implémentation complète. Prêts à décrypter leurs secrets? Plongeons dans le code.

[🔗 Explorez l'univers fascinant des fonctions de hachage sur notre dépôt GitHub](https://github.com/jterrazz/42-ssl-md5?source=post_page-----78c17e657794--------------------------------)

## 🔐 Fonctions de hachage: l'armure invisible de votre vie numérique

Voyez les fonctions de hachage comme l'armure invisible du monde numérique. Elles œuvrent sans relâche en coulisses pour:

* **Garantir l'intégrité des données**, en s'assurant que les fichiers et les messages que vous envoyez et recevez sont la copie conforme de l'original.
* **Protéger les mots de passe**, sans jamais stocker leur version en clair.
* Alimenter la **preuve de travail** (*proof of work*), un concept fondamental pour des cryptomonnaies comme le Bitcoin et l'Ethereum.
* Forger les **signatures numériques**, l'équivalent en ligne d'une signature manuscrite ayant force de loi.

Ces piliers de la sécurité numérique prennent n'importe quelle donnée que vous leur soumettez—d'un simple caractère à un fichier colossal—et la transforment en une chaîne de caractères de longueur fixe, appelée *hachage* ou *hash*. C'est l'empreinte digitale unique de vos données.

* **MD5** produit un hachage de 128 bits (soit 32 caractères hexadécimaux).
* **SHA-256** génère un hachage de 256 bits (soit 64 caractères hexadécimaux).

![Visualisation d'une fonction de hachage](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZh9gQlawdGcwSrCO0KOeA.png)

### Les propriétés essentielles d'une fonction de hachage robuste

Une fonction de hachage digne de ce nom possède plusieurs propriétés clés qui en font un véritable couteau suisse de la cryptographie:

1. **Déterminisme**: Même entrée, même sortie. Systématiquement.
2. **Rapidité**: Elles sont conçues pour être fulgurantes, calculant des hachages en un éclair.
3. **Irréversibilité**: Impossible de remonter à l'entrée à partir du hachage. C'est une voie à sens unique.
4. **Résistance aux collisions**: Pratiquement impossible de trouver deux entrées distinctes qui produisent le même hachage.
5. **Effet d'avalanche**: Modifiez un seul bit dans l'entrée, et le hachage en sortie est transformé de manière drastique et imprévisible.

## Le duel: MD5 vs SHA-256

### MD5: le vétéran sur le déclin

MD5 fut une véritable bête de somme en son temps, mais son heure est passée. Des vulnérabilités critiques y ont été découvertes, notamment une sensibilité aux attaques par collision, où des entrées différentes peuvent produire le même hachage. Cela le rend absolument rédhibitoire pour toute application liée à la sécurité.

Alors, où pourriez-vous encore croiser MD5?

* Comme simple somme de contrôle (*checksum*) pour vérifier l'intégrité d'un fichier contre une corruption accidentelle.
* Dans des systèmes hérités ou des applications non critiques où seule la vitesse compte.

**En bref, n'utilisez jamais MD5 pour la sécurité.** Ce serait comme vous présenter à un duel au pistolet armé d'un couteau.

### SHA-256: la référence actuelle

SHA-256 fait partie de la famille SHA-2, conçue par la NSA pour succéder à SHA-1 (qui s'est également révélé vulnérable). Il constitue aujourd'hui la norme de l'industrie pour un large éventail d'applications.

SHA-256 est considéré comme sûr car:

* Inverser le hachage pour retrouver l'entrée originale est pratiquement infaisable sur le plan calculatoire.
* Il possède une forte résistance aux collisions, ce qui rend extrêmement difficile la découverte de deux entrées ayant le même hachage.

Toutefois, malgré sa robustesse, il n'est pas recommandé d'utiliser SHA-256 seul pour stocker des mots de passe. Sa rapidité le rend vulnérable aux attaques par force brute. Pour cette tâche, des algorithmes plus lents et plus complexes comme Bcrypt ou Scrypt sont de rigueur.

## Sous le capot: la mécanique interne du hachage

### Étape 1: la préparation du message

Avant que le calcul ne puisse commencer, le message d'entrée doit être préparé selon des règles précises:

1. Le message est décomposé en **blocs de 512 bits**.
2. Un unique bit `1` est ajouté à la fin du message.
3. Des bits `0` sont ajoutés jusqu'à ce que la longueur du message soit à 64 bits près d'un multiple de 512.
4. Les 64 derniers bits sont utilisés pour stocker la longueur du message original.

![Formatage du message](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6Lplvsky40XwCE3zBhsjOA.png)
*La taille du message formaté doit être un multiple de 512 bits.*

Voici un aperçu de la manière dont on pourrait construire ce message formaté en C:

```c
unsigned char build_msg(const char msg, size_t msg_len, size_t formatted_msg_len, bool is_little_endian)
{
  unsigned char  formatted_msg;
  size_t         cursor;

  if (! (formatted_msg = malloc(formatted_msg_len)))
    return (NULL) ;

  ft_memcpy(formatted_msg, msg, msg_len);
  formatted_msg[msg_len]   = 0b10000000;
  cursor = msg_len + 1;

  while (cursor < formatted_msg_len)
    formatted_msg[cursor++] = 0;

  (uint64_t )(formatted_msg + cursor - 8) =
    is_little_endian ? 8 + msg_len : ft_bswap_uint64(8, msg_len);

  return (formatted_msg);
}
```

Pour obtenir la longueur du message formaté, une élégante astuce de manipulation de bits (*bitwise*) permet d'aligner la longueur sur un multiple de `X` octets:

```c
aligned = (nb + (X-1)) & ~(X-1)
```

Dans notre code, cela ressemble à ceci:

```c
#define DEC(x) (x - 1)

// Chunks of 512 bits
#define MD5_CHUNK_SIZE 64

// +1 for the appended '1'
// +8 for the size in 64 bits
#define MD5_CHUNKS_SIZE(len) (len + 1 + 8 + DEC(MD5_CHUNK_SIZE) ) &
~DEC(MD5_CHUNK_SIZE)
#define MD5_CHUNK_COUNT(len) (MD5_CHUNKS_SIZE(len) / MD5_CHUNK_SIZE)

formatted_msg_len = CHUNK_SIZE x CHUNK_COUNT;
```

### Big-Endian vs Little-Endian: le duel des octets

Avant d'aller plus loin, un mot rapide sur l'*endianness* (ou boutisme). C'est une question d'ordre des octets dans la mémoire de l'ordinateur.

* **Little-endian**: L'octet de poids faible est stocké en premier.
* **Big-endian**: L'octet de poids fort est stocké en premier.

[🔗 Plongez plus profondément dans le terrier du lapin de l'endianness (en anglais)](https://medium.com/@nonuruzun/little-big-endian-dc9abe36270?source=post_page-----78c17e657794--------------------------------)

Pour basculer de l'un à l'autre, nous pouvons utiliser une fonction d'inversion d'octets (*byte-swapping*):

```c
uint64_t  ft_bswap_uint64(uint64_t x)
{
  x = ((x < 8) & 0XFF00FF00FF00FF00ULL ) | ((x >> 8) & 0X00FF00FF00FF00FFULL);
  x = ((x < 16) & 0xFFFF0000FFFF0000ULL) | ((x >> 16) &
0x0000FFFF0000FFFFULL);

  return (x < 32) | (x >> 32) ;
}
```

Cette fonction réorganise les octets selon une cascade d'échanges astucieux.

![Schéma d'inversion des octets](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i8YyrTUB3CcCpwK2PacC5g.png)

### Étape 2: le cœur du réacteur, la boucle de traitement

C'est ici que le véritable travail commence. Les deux algorithmes traitent le message par blocs de 512 bits, mais ils utilisent un nombre différent de tampons (*buffers*) internes:

* MD5: 4 tampons de 32 bits
* SHA-256: 8 tampons de 32 bits

Ces tampons sont initialisés avec des valeurs spécifiques, puis mis à jour au fil d'une série de tours. Chaque tour implique un mélange complexe d'opérations bitwise, d'additions modulaires et de fonctions non linéaires spécifiques.

Pour ceux qui souhaitent explorer les entrailles des algorithmes:

* [🔗 Plongée dans l'algorithme MD5 (en anglais)](https://en.wikipedia.org/wiki/MD5?source=post_page-----78c17e657794--------------------------------#Pseudocode)
* [🔗 Explication de l'algorithme SHA-256 (en anglais)](https://en.wikipedia.org/wiki/SHA-2?source=post_page-----78c17e657794--------------------------------#Pseudocode)

Ou, consultez directement le code C:

* [Implémentation de SHA-256](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_sha256/sha256.c)
* [Implémentation de MD5](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_md5/md5.c)

### Le bouquet final: l'assemblage du hachage

Une fois que chaque bloc a été traité, les valeurs finales des tampons sont concaténées pour former le hachage.

```c
char build_hash(uint32_t buffers, size_t buffer_count, bool is_little_endian)
{
  char      hash;
  char      hash_tmp;
  size_t    buffer_i;
  uint32_t  buffer;
  
  buffer_i = 0;

  if (!(hash = ft_strnew(buffer_count 8)))
    return (NULL);

  while (buffer_i < buffer_count) {
    buffer = is_little_endian ? ft_bswap_uint32(buffers[buffer_i]) :
buffers[buffer_il;

    if (!(hash_tmp = ft_uitoa_base_len(buffer, 16, 'a', 8)))
      return (NULL);

    ft_strncpy(hash + (buffer_i 8), hash_tmp, 8);
    free(hash_tmp);
    buffer_i++;
  }
  
  return (hash);
}
```

Une dernière particularité pour MD5: ses tampons sont au format little-endian, ils doivent donc subir une inversion d'octets avant d'être convertis en la chaîne hexadécimale finale.

```c
uint32_t ft_bswap_uint32(uint32_t x)
{
  x = ((x < 8) & 0xFF00FF00) | ((x > 8) & 0xFF00FF);
  
  return (x << 16) (x >> 16);
}
```

## Si les détails vous semblent complexes

Pas de panique. Cet excellent guide décortique le processus de SHA-256 étape par étape, le rendant parfaitement accessible.

* [🔗 Guide détaillé de SHA-256, étape par étape (en anglais)](https://docs.google.com/spreadsheets/d/1mOTrqckdetCoRxY5QkVcyQ7Z0gcYIH-Dc0tu7t9f7tw/edit?source=post_page-----78c17e657794--------------------------------#gid=2107569783)

## En conclusion

Et voilà, notre exploration des fonctions de hachage touche à sa fin. Vous avez vu ce qu'elles font, pourquoi elles sont essentielles à la sécurité numérique, et même comment les construire à partir de zéro.

Le monde de la cryptographie est en perpétuel mouvement. Ce qui est sécurisé aujourd'hui pourrait être vulnérable demain. Continuez d'apprendre, d'expérimenter… et qui sait? Vous développerez peut-être la prochaine génération d'algorithmes qui protègeront notre avenir numérique.

Et n'oubliez pas de jouer avec le code dans le dépôt GitHub. Il n'y a pas de meilleure façon d'apprendre que par la pratique.

Bon hachage
