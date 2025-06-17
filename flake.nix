{
  description = "something fun :)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        node = pkgs.nodejs_latest;
      in
      {
        devShells = {
          default = pkgs.mkShell {
            # TODO: AUTOMATE PRETTIER
            buildInputs = [
              node
              pkgs.nodePackages.json-server
              pkgs.nodePackages.vscode-langservers-extracted
              pkgs.nodePackages.prettier
              pkgs.deno
              pkgs.dprint
              pkgs.typescript-language-server
              pkgs.nodePackages.ts-node

            ];

            shellHook = ''
              export PATH=$PATH:${pkgs.lib.makeBinPath [ pkgs.nodePackages.json-server ]}
              echo "node `${node}/bin/node --version`"
            '';
          };
        };
      }
    );
}
