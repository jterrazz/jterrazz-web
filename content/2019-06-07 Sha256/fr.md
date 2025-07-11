![](assets/thumbnail.jpg)

# Le Hachage En C: Plongée Au Cœur De SHA-256 Et MD5

Vous êtes-vous déjà demandé ce qui protège votre monde en ligne? De vos transactions bancaires à vos mots de passe, les héros méconnus de cet univers sont les fonctions de hachage cryptographiques. Aujourd'hui, je lève le rideau sur deux des plus célèbres d'entre elles: MD5 et SHA-256. Et nous n'allons pas nous contenter de théorie: nous allons mettre les mains dans le cambouis avec du code en C.

J'ai même inclus un lien vers un dépôt GitHub avec l'implémentation complète. Prêt à faire passer vos connaissances en cryptographie au niveau supérieur? C'est parti.

[🔗 Plongez dans l'univers fascinant des fonctions de hachage sur notre dépôt GitHub](https://github.com/jterrazz/42-ssl-md5?source=post_page-----78c17e657794--------------------------------)

## 🔐 Fonctions Cryptographiques: Les Gardiens Silencieux De Votre Vie Numérique

Imaginez les fonctions cryptographiques comme le champ de force invisible de l'univers numérique. Elles travaillent constamment en coulisses pour:

* **Garantir l'intégrité des données**, en s'assurant que les fichiers et messages que vous envoyez et recevez sont exactement conformes à l'original.
* **Vérifier les mots de passe en toute sécurité**, sans jamais les stocker en clair.
* Être le moteur de la **"preuve de travail"** (*proof of work*), un concept fondamental pour les cryptomonnaies comme le Bitcoin et l'Ethereum.
* Permettre les **signatures numériques**, l'équivalent en ligne d'une signature manuscrite ayant une valeur juridique.

Ces puissants outils numériques prennent n'importe quelle entrée—un simple caractère ou un fichier volumineux—et la transforment en une chaîne de caractères de longueur fixe, appelée *hash*. C'est un peu comme créer une empreinte digitale unique pour vos données.

* **MD5** produit un *hash* de 128 bits (soit 32 caractères hexadécimaux).
* **SHA-256** génère un *hash* de 256 bits (soit 64 caractères hexadécimaux).

![Hash Function Visualization](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZh9gQlawdGcwSrCO0KOeA.png)

### Les Super-pouvoirs D'une Bonne Fonction De Hachage

Une bonne fonction de hachage possède quelques propriétés clés qui en font un véritable couteau suisse de la cryptographie:

1. **Déterministe**: Une même entrée produit toujours, sans exception, une même sortie.
2. **Rapide**: Elles sont conçues pour la vitesse, calculant les *hashes* en un éclair.
3. **À sens unique**: Il est impossible de retrouver l'entrée à partir du *hash*. C'est une rue à sens unique.
4. **Résistante aux collisions**: Il est pratiquement impossible de trouver deux entrées différentes qui produisent le même *hash*.
5. **Effet d'avalanche**: Changez un seul bit dans l'entrée, et le *hash* en sortie est modifié de manière drastique et imprévisible.

## Le Grand Duel: MD5 vs. SHA-256

### MD5: Le Vétéran (qui Devrait Prendre Sa retraite)

MD5 a été un véritable cheval de bataille en son temps, mais cette époque est révolue. Des vulnérabilités importantes y ont été découvertes, notamment sa sensibilité aux "attaques par collision", où différentes entrées peuvent produire le même *hash*. Cela le rend absolument impropre à tout usage lié à la sécurité.

Alors, où peut-on encore croiser MD5?

* Comme simple somme de contrôle (*checksum*) pour vérifier l'intégrité d'un fichier contre une corruption accidentelle.
* Dans des systèmes hérités ou des applications non critiques où seule la vitesse compte.

**En résumé: n'utilisez jamais MD5 pour la sécurité.** C'est comme se présenter à une fusillade avec un couteau.

### SHA-256: la Référence Actuelle

SHA-256 fait partie de la famille SHA-2, conçue par la NSA pour succéder à SHA-1 (qui s'est également révélé vulnérable). C'est aujourd'hui la norme de l'industrie pour un large éventail d'applications.

SHA-256 est considéré comme sûr car:

* Inverser le *hash* pour retrouver l'entrée originale est calculatoirement infaisable.
* Il possède une forte résistance aux collisions, ce qui rend incroyablement difficile de trouver deux entrées avec le même *hash*.

Cependant, malgré ses atouts, je ne recommanderais pas d'utiliser SHA-256 "brut" pour stocker des mots de passe. Sa rapidité le rend vulnérable aux attaques par force brute. Pour le hachage de mots de passe, des algorithmes plus lents et plus complexes comme Bcrypt ou Scrypt sont les solutions à privilégier.

## Sous Le Capot: Comment la Magie Opère

### Étape 1: Préparation Du Message

Avant que le hachage ne puisse commencer, le message d'entrée doit être formaté d'une manière très spécifique:

1. Le message est découpé en **blocs de 512 bits**.
2. Un bit unique '1' est ajouté à la fin du message.
3. Des bits '0' sont ajoutés jusqu'à ce que la longueur du message soit à 64 bits d'un multiple de 512.
4. Les 64 derniers bits sont utilisés pour stocker la longueur du message original.

![Message Formatting](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6Lplvsky40XwCE3zBhsjOA.png)
*La taille du message formaté doit être un multiple de 512 bits*

Voici un aperçu de la manière dont on peut construire ce message formaté en C:

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

Pour obtenir la longueur du message formaté, une astuce binaire élégante peut être utilisée pour aligner la longueur sur un multiple de 'X' octets:

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

### Le Duel: Big-Endian vs. Little-Endian

Avant d'aller plus loin, un mot rapide sur l'endianness. C'est une question d'ordre des octets en mémoire.

* **Little-endian**: L'octet le moins significatif est stocké en premier.
* **Big-endian**: L'octet le plus significatif est stocké en premier.

[🔗 Explorez les profondeurs de l'endianness (en anglais)](https://medium.com/@nonuruzun/little-big-endian-dc9abe36270?source=post_page-----78c17e657794--------------------------------)

Pour basculer entre les deux, nous pouvons utiliser une fonction d'inversion d'octets (*byte-swapping*):

```c
uint64_t  ft_bswap_uint64(uint64_t x)
{
  x = ((x < 8) & 0XFF00FF00FF00FF00ULL ) | ((x >> 8) & 0X00FF00FF00FF00FFULL);
  x = ((x < 16) & 0xFFFF0000FFFF0000ULL) | ((x >> 16) &
0x0000FFFF0000FFFFULL);

  return (x < 32) | (x >> 32) ;
}
```

Cette fonction réorganise les octets selon un schéma astucieux et expansif.

![Byte Shuffling](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i8YyrTUB3CcCpwK2PacC5g.png)

### Étape 2: La Boucle De Traitement Principale

C'est ici que le véritable travail a lieu. Les deux algorithmes traitent le message par blocs de 512 bits, mais ils utilisent un nombre différent de tampons (*buffers*) internes:

* MD5: 4 tampons de 32 bits
* SHA-256: 8 tampons de 32 bits

Ces tampons sont initialisés avec des valeurs spécifiques, puis mis à jour à travers une série de "rondes". Chaque ronde implique un mélange complexe d'opérations bit à bit, d'additions modulaires et de fonctions non linéaires personnalisées.

Pour ceux qui veulent voir les entrailles des algorithmes:

* [🔗 Plongée dans l'algorithme MD5 (en anglais)](https://en.wikipedia.org/wiki/MD5?source=post_page-----78c17e657794--------------------------------#Pseudocode)
* [🔗 Explication de l'algorithme SHA-256 (en anglais)](https://en.wikipedia.org/wiki/SHA-2?source=post_page-----78c17e657794--------------------------------#Pseudocode)

Ou, consultez directement le code C:

* [Implémentation de SHA-256](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_sha256/sha256.c)
* [Implémentation de MD5](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_md5/md5.c)

### La Touche Finale: L'assemblage Du Hash

Une fois que chaque bloc a été traité, les valeurs finales des tampons sont concaténées pour former le *hash*.

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

Une dernière particularité pour MD5: ses tampons sont au format *little-endian*, ils doivent donc subir une inversion d'octets avant d'être convertis en chaîne hexadécimale finale.

```c
uint32_t ft_bswap_uint32(uint32_t x)
{
  x = ((x < 8) & 0xFF00FF00) | ((x > 8) & 0xFF00FF);
  
  return (x << 16) (x >> 16);
}
```

## Vous Vous Sentez Un Peu Perdu?

Si les détails de SHA-256 vous semblent un peu denses, ne vous inquiétez pas. J'ai trouvé ce guide pas à pas exceptionnel qui décortique tout le processus.

* [🔗 Guide pas à pas de SHA-256 (en anglais)](https://docs.google.com/spreadsheets/d/1mOTrqckdetCoRxY5QkVcyQ7Z0gcYIH-Dc0tu7t9f7tw/edit?source=post_page-----78c17e657794--------------------------------#gid=2107569783)

## Pour Conclure

Et voilà, un tour d'horizon express des fonctions de hachage cryptographiques. Vous avez vu ce qu'elles font, pourquoi elles sont essentielles à la sécurité numérique, et même comment les construire à partir de zéro.

Le monde de la cryptographie est en perpétuel mouvement. Ce qui est sûr aujourd'hui pourrait être vulnérable demain. Continuez d'apprendre, continuez d'expérimenter, et peut-être serez-vous celui ou celle qui construira la prochaine génération d'algorithmes sécurisés.

Et n'oubliez pas de jouer avec le code dans le dépôt GitHub. Il n'y a pas de meilleure façon d'apprendre que par la pratique.

Bon hachage
