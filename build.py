import sys, os
import simplejson as json


BUILD_FILE = "build.json"


def create_file(build_file, build_component):
    path, fn = os.path.split(build_file)

    f = open(build_file)
    config = json.load(f)
    f.close()

    target_file_path = os.path.join(path, config['target'])
    if build_component == 1 and config.has_key('component'):
        config['sources'].append(config['component'])

    lines = []
    for src in config['sources']:
        print src
        lines.append("/* --- %s --- */\n" % src)
        f = open(os.path.join(path, src), 'r')
        lines.extend(f.readlines())
        f.close()
        lines.append("\n\n")

    print "Write file: %s" % target_file_path
    target_dir = '/'.join(target_file_path.split('/')[:-1])
    if not os.path.isdir(target_dir) and len(target_dir) > 0:
        os.makedirs(target_dir)

    concatenated_file = open(target_file_path, 'w')
    concatenated_file.writelines(lines)
    concatenated_file.close()


def build_scg(interface):
    build_file = "scg/%s" % BUILD_FILE
    print ""
    print "Building scg module"
    create_file(build_file, interface)


def build_scs(interface):
    build_file = "scs/%s" % BUILD_FILE
    print ""
    print "Building scs module"
    create_file(build_file, interface)


def build_html(interface):
    build_file = "html/%s" % BUILD_FILE
    print ""
    print "Building html module"
    create_file(build_file, interface)


def build_github(interface):
    build_file = "github/%s" % BUILD_FILE
    print ""
    print "Building github module"
    create_file(build_file, interface)


def build_all(interface):
    print ""
    print "Buildng all components...."
    build_scg(interface)
    build_scs(interface)
    build_html(interface)
    build_github(interface)
    print "Done."


def select_component():
    chain_map = {
        '1': build_scg,
        '2': build_scs,
        '3': build_html,
        '4': build_github,
        '5': build_all,
    }
    prompt = """
1) scg
2) scs
3) html
4) github
5) all
Select component to build:
"""
    component = None
    while not component:
        chain = raw_input(prompt)
        if chain_map.has_key(chain):
            component = chain_map.get(chain)
    return component


def select_interface():
    prompt = """
1 - build
0 - do not build
Build component interface (0):
"""
    build_interface_flag = raw_input(prompt)

    if build_interface_flag != '0' and build_interface_flag != '1':
        print "Unknown selected. Using default 0 value."
        return 0
    return int(build_interface_flag)


def main():
    component = select_component()
    interface = select_interface()

    component(interface)


if __name__ == '__main__':
    main()
#     if len(sys.argv) > 2:
#         create_file(sys.argv[1], int(sys.argv[2]))
#     else:
#         create_file(sys.argv[1], 0)

