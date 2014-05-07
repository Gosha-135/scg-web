"""
Concatenates all js files from specified directory to the single js file.
Usage example:
concatenate_js.py <js_source_dir> <concatenated_file.js>
"""
import sys
import os

sources = [
        'scg.js',
        'scg-debug.js',
        'scg-math.js',
        'scg-model-objects.js',
        'scg-alphabet.js',
        'scg-render.js',
        #'scg-render-objects.js',
        'scg-scene.js',
        'scg-layout.js',
        'scg-component.js'
        ]

def create_file(source_dir, target_file_path):
    lines = []
    for src in sources:
        lines.append("/* --- %s --- */\n" % src)
        f = open(os.path.join('src', src), 'r')
        lines.extend(f.readlines())
        f.close()
        lines.append("\n\n")

    target_dir = '/'.join(target_file_path.split('/')[:-1])
    if not os.path.isdir(target_dir) and len(target_dir) > 0:
        os.makedirs(target_dir)

    concatenated_file = open(target_file_path, 'w')
    concatenated_file.writelines(lines)
    concatenated_file.close()

if __name__ == '__main__':
    create_file(sys.argv[1], sys.argv[2])
